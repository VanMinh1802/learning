const todoRepository = require("../repositories/todo.repository");

class TodoService {
  async getAllTodos() {
    const todos = await todoRepository.getAll();

    return todos;
  }

  async createTodo(title) {
    if (!title || title.trim() === "") {
      const error = new Error("Title is required");
      error.status = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    const todoData = { title: title.trim() };
    return await todoRepository.create(todoData);
  }

  async getTodoById(id) {
    const todo = await todoRepository.getById(id);
    if (!todo) {
      const error = new Error("Todo not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    return todo;
  }

  async updateTodo(id, updateData) {
    const existingTodo = await todoRepository.getById(id);
    if (!existingTodo) {
      const error = new Error("Todo not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    const { title, completed } = updateData;
    if (
      typeof title !== "string" ||
      typeof completed !== "boolean" ||
      title.trim() === ""
    ) {
      const error = new Error("Invalid request body");
      error.status = 400;
      error.code = "VALIDATION_ERROR";
      throw error;
    }

    const cleanData = {
      title: title.trim(),
      completed: completed,
    };

    return await todoRepository.update(id, cleanData);
  }

  async deleteTodo(id) {
    const existingTodo = await todoRepository.getById(id);
    if (!existingTodo) {
      const error = new Error("Todo not found");
      error.status = 404;
      error.code = "NOT_FOUND";
      throw error;
    }

    return await todoRepository.remove(id);
  }
}

module.exports = new TodoService();
