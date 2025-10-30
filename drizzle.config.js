require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  schema: "./src/core/schema.js", // Path to the schema file
  out: "./drizzle", // Output directory for generated files
  dialect: "postgresql", // Database driver
  dbCredentials: {
    connectionString: process.env.DATABASE_URL, // Database connection string from environment variables
  },
};
