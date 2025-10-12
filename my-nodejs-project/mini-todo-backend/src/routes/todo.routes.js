const express = require("express");
const todoController = require("../controllers/todo.controller");

const router = express.Router();

router.get("/", todoController.getAllTodos);

router.post("/", todoController.createTodo);

router.get("/:id", todoController.getTodoById);

router.put("/:id", todoController.updateTodo);

router.delete("/:id", todoController.deleteTodo);

module.exports = router;
