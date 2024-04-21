import knex from "knex";

export default knex({
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT) || 5432,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: process.env.PG_SSL === "true",
  },
});
