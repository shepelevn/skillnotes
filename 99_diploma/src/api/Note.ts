export type Note = {
  id: number;
  title: string;
  text: string;
  created_at: Date;
  user_id: number;
  archived: boolean;
};

export function isNote(note: Record<string, any>): note is Note {
  if (typeof note.id !== "number") {
    return false;
  }

  if (typeof note.title !== "string") {
    return false;
  }

  if (typeof note.text !== "string") {
    return false;
  }

  if (!(note.created_at instanceof Date)) {
    return false;
  }

  if (typeof note.user_id !== "number") {
    return false;
  }

  if (typeof note.archived !== "boolean") {
    return false;
  }

  return true;
}

export function isNotesArray(notes: Array<Record<string, any>>): notes is Note[] {
  for (const note of notes) {
    if (!isNote(note)) {
      return false;
    }
  }

  return true;
}
