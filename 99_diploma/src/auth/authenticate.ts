import { Request, Response } from "express";
import knex from "../knex";
import { noop } from "../util/noop";
import User from "./User";

export async function authenticate(req: Request, _res: Response, next: () => void) {
  const userId = req.session.userId;

  if (!userId) {
    next();
    return;
  }

  const user = await findUser(userId);

  if (!user) {
    req.session.destroy(noop);
    next();
    return;
  }

  req.user = user;

  next();
}

async function findUser(id: number): Promise<User> {
  return await knex("users").first().where("id", id);
}
