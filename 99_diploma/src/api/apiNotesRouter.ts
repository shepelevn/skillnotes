import express, { Request, Response } from "express";
import { authenticate } from "../auth/authenticate";
import { authorize } from "../auth/authorize";
import knex from "../knex";
import { Note, isNotesArray } from "./Note";
import { getMonthsAgo } from "../util/time";
import ApiError from "./ApiError";
import User from "../auth/User";
import NoteData from "./NoteData";

const apiNotesRouter = express.Router();

apiNotesRouter.use(authenticate);
apiNotesRouter.use(authorize);

apiNotesRouter.get("/", async (req: Request, res: Response) => {
  const ageParam = req.query.age;

  if (typeof ageParam !== "string") {
    throw new Error("req.query.age is not string");
  }

  const age = ageParam ? ageParam.trim() : "1month";

  let page = Number(req.query.page);

  if (isNaN(page) || page <= 0) {
    page = 1;
  }

  try {
    const notes = await getNotes(age, page, req.user.id);
    res.json(notes);
  } catch (error) {
    catchApiError(error, res);
    return;
  }
});

apiNotesRouter.get("/:noteId", async (req: Request, res: Response) => {
  const noteId = getNoteId(req, res);

  if (!noteId) {
    return;
  }

  const note = await getNote(noteId);

  if (!checkNote(note, noteId, req.user, res)) {
    return;
  }

  res.json(note);
});

apiNotesRouter.post("/", async (req: Request, res: Response) => {
  const noteData = getNoteData(req, res);

  if (!noteData) {
    return;
  }

  const newNote = {
    title: noteData.title,
    text: noteData.text,
    user_id: req.user.id,
  };

  const insertResult = await knex("notes").insert(newNote).returning("*");

  res.json(insertResult);
});

apiNotesRouter.put("/:noteId", async (req: Request, res: Response) => {
  const noteId = getNoteId(req, res);

  if (!noteId) {
    return;
  }

  const note = await getNote(noteId);

  if (!checkNote(note, noteId, req.user, res)) {
    return;
  }

  const noteData = getNoteData(req, res);

  if (!noteData) {
    return;
  }

  const updatedNoteArray: Note[] = await knex("notes")
    .update({
      title: noteData.title,
      text: noteData.text,
    })
    .where("id", noteId)
    .returning("*");

  const updatedNote = updatedNoteArray[0];

  res.json(updatedNote);
});

apiNotesRouter.post("/:noteId/archive", async (req: Request, res: Response) => {
  const noteId = getNoteId(req, res);

  if (!noteId) {
    return;
  }

  const note = await getNote(noteId);

  if (!checkNote(note, noteId, req.user, res)) {
    return;
  }

  if ((note as Note).archived) {
    res.status(400).json({ error: "Note is already archived" });
    return;
  }

  const noteArray: Note[] = await knex("notes").update({ archived: true }).where("id", noteId).returning("*");

  const archivedNote: Note = noteArray[0];

  res.status(200).json(archivedNote);
});

apiNotesRouter.post("/:noteId/unarchive", async (req: Request, res: Response) => {
  const noteId = getNoteId(req, res);

  if (!noteId) {
    return;
  }

  const note = await getNote(noteId);

  if (!checkNote(note, noteId, req.user, res)) {
    return;
  }

  if (!(note as Note).archived) {
    res.status(400).json({ error: "Note is already unarchived" });
    return;
  }

  const noteArray: Note[] = await knex("notes").update({ archived: false }).where("id", noteId).returning("*");

  const unarchivedNote: Note = noteArray[0];

  res.status(200).json(unarchivedNote);
});

apiNotesRouter.delete("/archived", async (req: Request, res: Response) => {
  await knex("notes").delete().where("user_id", req.user.id).andWhere("archived", true);

  res.sendStatus(204);
});

apiNotesRouter.delete("/:noteId", async (req: Request, res: Response) => {
  const noteId = getNoteId(req, res);

  if (!noteId) {
    return;
  }

  const note = await getNote(noteId);

  if (!checkNote(note, noteId, req.user, res)) {
    return;
  }

  await knex("notes").delete().where("id", noteId);

  res.sendStatus(204);
});

const PAGE_COUNT = 20;

async function getNotes(age: string, page: number, userId: number): Promise<Note[]> {
  const notesQuery = knex("notes")
    .select()
    .where("user_id", userId)
    .offset((page - 1) * PAGE_COUNT)
    .limit(PAGE_COUNT)
    .modify((builder) => {
      switch (age) {
        case "1month":
          builder.andWhere("created_at", ">=", getMonthsAgo(1)).andWhere("archived", false);
          break;
        case "3months":
          builder.andWhere("created_at", ">=", getMonthsAgo(3)).andWhere("archived", false);
          break;
        case "alltime":
          builder.andWhere("archived", false);
          break;
        case "archived":
          builder.andWhere("archived", true);
          break;
        default:
          throw new ApiError("Wrong age parameter");
      }
    });

  const notes = await notesQuery;

  if (!isNotesArray(notes)) {
    throw new TypeError("notes array has an item which is not the Note type");
  }

  return notes;
}

function getNote(noteId: string): Promise<Note | undefined> {
  return knex("notes").first().where("id", noteId);
}

function checkNote(note: Note | undefined, noteId: string, user: User, res: Response): boolean {
  if (!note) {
    res.status(404).json({ error: `Note with id: ${noteId} is not found` });
    return false;
  }

  if (note.user_id !== user.id) {
    res.status(403).json({ error: "Note belongs to the other user" });
    return false;
  }

  return true;
}

function getNoteId(req: Request, res: Response): string | undefined {
  const noteId: string = req.params.noteId;

  try {
    checkNoteId(noteId);
  } catch (error) {
    catchApiError(error, res);
    return undefined;
  }

  return noteId;
}

function checkNoteId(noteIdString: string): void {
  const noteId: number = Number(noteIdString);

  if (isNaN(noteId) || !Number.isInteger(noteId) || noteId <= 0) {
    throw new ApiError("Wrong id format");
  }
}

function catchApiError(error: unknown, res: Response): void {
  if (error instanceof ApiError) {
    res.status(400).json({ error: error.message });
    return;
  } else if (error instanceof Error) {
    res.status(500).json({ error: "Internal server error" });

    throw error;
  }
}

function getNoteData(req: Request, res: Response): NoteData | null {
  const title = req.body.title.trim();
  const text = req.body.text.trim();

  if (!title) {
    res.status(400).json({ error: "Title is not provided" });
    return null;
  }

  if (!text) {
    res.status(400).json({ error: "Text is not provided" });
    return null;
  }

  return { title, text };
}

export default apiNotesRouter;
