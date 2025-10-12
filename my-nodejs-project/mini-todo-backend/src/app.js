const express = require("express");
const todoRoutes = require("./routes/todo.routes.js");
const notFoundHandler = require("./middlewares/notFoundHandler.js");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/todos", todoRoutes);

app.use("/api/todos/:id", todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
