import { Knex } from "knex";
import { faker } from "@faker-js/faker";
import dedent from "dedent";

import User from "../src/auth/User";
import { randomInt } from "../src/util/randomInt";
import { capitalize } from "../src/util/capitalize";
import { randomDate } from "../src/util/time";
import ms from "ms";

const NOTES_PER_USER = 60;

export async function seed(knex: Knex): Promise<void> {
  await knex("notes").truncate();

  const users = await knex("users").select();

  await knex("notes").insert(createNotes(users, NOTES_PER_USER));
}

function createNotes(users: User[], count: number) {
  const notes = [];

  for (const user of users) {
    for (let i = 0; i < count; i++) {
      const created = randomDate(Date.now() - ms("30d") * 4);

      notes.push({
        title: capitalize(faker.word.words(randomInt(2, 5))),
        markdown: generateMarkdown(),
        created,
        modified: created,
        archived: Boolean(randomInt(0, 1)),
        user_id: user.id,
      });
    }
  }

  return notes;
}

function generateMarkdown(): string {
  const heading = faker.lorem.words(randomInt(3, 5));

  const subheading = faker.lorem.words(randomInt(3, 5));

  return dedent(`
    # ${heading}

    ## ${subheading}

    ${faker.lorem.paragraph(randomInt(1, 4))}

    ${faker.lorem.paragraph(randomInt(1, 4))}

    ${faker.lorem.paragraph(randomInt(1, 4))}
  `);
}
