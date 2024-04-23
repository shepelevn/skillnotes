import { Knex } from "knex";
import UserData from "../src/auth/UserData";
import { hash } from "../src/util/hash";

const USERS_COUNT = 3;

export async function seed(knex: Knex): Promise<void> {
  await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

  await knex("sessions").truncate();

  await knex("users").insert(createUsers(USERS_COUNT));
}

function createUsers(count: number): UserData[] {
  const users: UserData[] = [];

  users.push({
    username: "user",
    password: hash("password"),
  });

  for (let i = 0; i < count; i++) {
    users.push({
      username: `user${i + 1}`,
      password: hash("password"),
    });
  }

  return users;
}
