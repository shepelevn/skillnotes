import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import nunjucks from "nunjucks";
import path from "path";
import connectSessionKnex from "connect-session-knex";
import ms from "ms";

import expressSession from "express-session";
declare module "express-session" {
  export interface SessionData {
    userId?: number;
  }
}

import knex from "./knex";
import pagesRouter from "./pagesRouter";
import authRouter from "./auth/authRouter";
import apiNotesRouter from "./api/apiNotesRouter";

const KnexSessionStore = connectSessionKnex(expressSession);

const store = new KnexSessionStore({
  knex,
  tablename: "sessions",
});

const app = express();

nunjucks.configure(path.join(__dirname, "..", "views"), {
  autoescape: true,
  express: app,
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("process.env.SESSION_SECRET is undefined");
}

app.use(
  expressSession({
    resave: true,
    saveUninitialized: true,
    secret: sessionSecret,
    // TODO: Change secure option to be dependent on check if dev or prod
    cookie: { secure: false, maxAge: ms("1d") },
    store,
  }),
);

app.use("", authRouter);
app.use("/api/notes", apiNotesRouter);

app.all("/api/*", (_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use("", pagesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`  Listening on http://localhost:${port}`);
});
