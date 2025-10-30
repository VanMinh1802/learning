const {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
} = require("drizzle-orm/pg-core"); //Import necessary functions from Drizzle ORM for PostgreSQL

//Define the "todos" table schema
const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(), //UUID primary key with default random value
  title: text("title").notNull(), //Non-nullable text field for the todo title
  completed: boolean("completed").default(false).notNull(), //Boolean field for completion status, defaulting to false
  inserted_at: timestamp("inserted_at", { withTimezone: true }).defaultNow(), //Timestamp field for when the todo was inserted, defaulting to the current time
});

module.exports = { todos };
