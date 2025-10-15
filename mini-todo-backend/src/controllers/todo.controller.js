const todoService = require("../services/todo.service.js");

exports.getAllTodos = async (req, res, next) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error) {
    next(error);
  }
};

exports.createTodo = async (req, res, next) => {
  try {
    const { title } = req.body;
    const newTodo = await todoService.createTodo(title);
    res.status(201).json({
      success: true,
      data: newTodo,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await todoService.getTodoById(id);
    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedTodo = await todoService.updateTodo(id, updateData);
    res.status(200).json({
      success: true,
      data: updatedTodo,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedTodo = await todoService.deleteTodo(id);
    res.status(200).json({
      success: true,
      data: deletedTodo,
    });
  } catch (error) {
    next(error);
  }
};
