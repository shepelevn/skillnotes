/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notes", function (table) {
    table.increments("id");
    table.string("title", 255).notNullable();
    table.text("text").notNullable();
    table.datetime("created").notNullable().defaultTo(knex.fn.now());
    table.boolean("archived").notNullable().defaultTo(false);

    table.integer("user_id").unsigned().notNullable();
    table.foreign("user_id").references("id").inTable("users").onUpdate("CASCADE").onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("notes");
};
