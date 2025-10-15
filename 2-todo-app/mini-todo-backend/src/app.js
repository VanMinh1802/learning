const express = require("express");
const todoRoutes = require("./routes/todo.routes.js");
const notFoundHandler = require("./middlewares/notFoundHandler.js");
const errorHandler = require("./middlewares/errorHandler.js");

/** Phong comment: Add thêm logger */
const logger = require("./middlewares/loggerHandler.js");

const app = express();

app.use(express.json());
app.use(logger);
app.use("/api/todos", todoRoutes);

/** Phong comment:
Đang mount cùng một router cho cả "/api/todos" và "/api/todos/:id" là dư thừa. Router đã xử lý ":id" bên trong, nên chỉ cần mount một lần tại "/api/todos" để tránh chạy middleware/handler hai lần và làm phức tạp luồng.
*/
app.use("/api/todos/:id", todoRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
