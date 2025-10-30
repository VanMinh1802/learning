require("dotenv").config(); //Load environment variables from .env file
const { drizzle } = require("drizzle-orm/postgres-js");
const { Pool } = require("pg"); //Driver for Postgres

const databaseUrl = process.env.DATABASE_URL; //Get database URL from environment variables

//check if databaseUrl is defined
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

//Create a new Postgres connection pool
const pool = new Pool({
  connectionString: databaseUrl,
});

//Create a Drizzle ORM instance using the Postgres pool
const db = drizzle(pool);

//Export the Drizzle ORM instance for use in other parts of the application
module.exports = {
  port: process.env.PORT || 3000,
  db,
};
