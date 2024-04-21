require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: "pg",
  connection: {
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    ssl: process.env.PG_SSL === "true",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};
