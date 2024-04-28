# SkillNotes

Web application for creating notes.

## README.md

* en [English](README.md)
* ru [Русский](readme/README.ru.md)

## Table of Contents

* [Project-description](#project-description)
* [Technologies used in backend](#technologies-used-in-backend)
* [Installation](#installation)
* [Development server launch](#development-server-launch)
* [Compilation and bundling of the project](#compilation-and-bundling-of-the-project)
* [Deploying on Vercel](#deploying-on-vercel)
* [Database seeding](#database-seeding)
* [Configuration](#configuration)
* [API information](#api-information)

## Project description

Personal notes service in Markdown format.
Service allows you to create, edit, archive, and delete notes.

## Technologies used in backend

* Node.js
* TypeScript
* Express.js
* PostgreSQL

## Installation

Steps to install the project:

1. Install npm packages by running `npm install`
2. Create configuration file `.env` using the example file `.env-sample`
3. Migrate database with `npx knex migrate:latest`
4. Seed database with data for testing if you need to `npm run seed`

## Development server launch

You can launch development server by using command `npm run dev`  
Server listens on URL: `http://localhost:3000`.

## Compilation and bundling of the project

Compilation and bundling of the project is done using command
`npm run build`.

## Deploying on Vercel

Before deploying the project you have to compile and bundle the code using
`npm run build` command, then you can deploy by using the command `vercel`.
In Vercel project you have to set up environment variables as they are
described in `.env-sample`.

## Database seeding

Seeding is done using the command `npm run seed`.

Seeder creates user with the username 'user' and password "password".

## Configuration

Configuration should be set inside `.env` file. The example can be found in  
`.env-sample` file.

## API information

### Notes on data

Note type:

```json
{
  "id": 1,
  "title": "Note title",
  "markdown": "# Some markdown",
  "created": "2024-03-25T05:16:28.717Z",
  "archived": false,
  "user_id": 1,
  "modified": "2024-03-25T05:16:28.717Z"
}
```

### Endpoints

#### GET `/api/notes` - Get notes list

Receives query-parameters:

`age` - string for filtering list of notes by date or presence in the archive

Possible values:

* `1month`
* `3months`
* `alltime`
* `archived`

`page` - pagination number

Returns the array with Note type

---

#### GET `/api/notes/{id}` - Get data about a specific note

Returns Note type

---

#### POST `/api/notes` - Create new note

Receives:

```json
{
  "title": "New note",
  "markdown": "# Some markdown text"
}
```

Returns Note type

---

#### PUT `/api/notes{id}` - Edit note

Receives:

```json
{
  "title": "New note",
  "markdown": "# Some markdown text"
}
```

Returns Note type

---

#### POST `/api/notes/{id}/archive` - Archive note

Returns Note type

---

#### POST `/api/notes/{id}/unarchive` - Restore note from archive

Returns Note type

---

#### DELETE `/api/notes/{id}` - Delete note

---

#### DELETE `/api/notes/archived` - Delete all notes in archive

---
