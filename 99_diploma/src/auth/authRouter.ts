import express from "express";
import bodyParser from "body-parser";

import knex from "../knex";
import { noop } from "../util/noop";
import { hash, compare } from "../util/hash";
import User from "./User";
import UserData from "./UserData";

const authRouter = express.Router();

authRouter.get("/logout", (req, res) => {
  req.session.destroy(noop);

  res.redirect("/");
});

authRouter.post("/login", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  const user = await findUserByUsername(username);

  if (!user || !compare(password, user.password)) {
    res.redirect("/?authError=true");
    return;
  }

  req.session.userId = user.id;

  res.redirect("/");
});

authRouter.post("/signup", bodyParser.urlencoded({ extended: false }), async (req, res) => {
  const username = req.body.username.trim();
  const password = req.body.password.trim();

  if (username === "") {
    const message = "Username can not be empty";
    res.redirect(`/?authError=${message}`);
    return;
  }

  if (password === "") {
    const message = "Password can not be empty";
    res.redirect(`/?authError=${message}`);
    return;
  }

  const user = await findUserByUsername(username);

  if (user) {
    const message = `User with username "${username}" already exists`;
    res.redirect(`/?authError=${message}`);
    return;
  }

  const newUser = createUser(username, password);

  try {
    const result = await knex("users").insert(newUser).returning("id");
    const id = result[0].id;

    req.session.userId = id;

    res.redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error inserting new user record into database");
      console.error(`Message: ${error.message}`);
      res.redirect("/?authError=Could not register user");
    }
  }
});

async function findUserByUsername(username: string): Promise<User> {
  return await knex("users").first().where("users.username", username);
}

function createUser(username: string, password: string): UserData {
  return {
    username,
    password: hash(password),
  };
}

export default authRouter;
