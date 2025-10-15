let todos = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Write first test", completed: true },
];

let currentId = 2;

exports.getAllTodos = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: todos,
  });
};

exports.createTodo = (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    const error = new Error("Title is required!");
    error.status = 400;
    return next(error);
  }

  /** Phong comment:
  Có thể chuẩn hoá input (trim, giới hạn độ dài) và tạo id bằng thư viện sinh id an toàn (uuid) để tránh trùng lặp khi gặp concurrency request
  */
  const newTodo = {
    id: ++currentId,
    title: title,
    completed: false,
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    data: newTodo,
  });
};

exports.getTodoById = (req, res, next) => {
  const todoId = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === todoId);

  if (todo) {
    res.status(200).json({
      success: true,
      data: todo,
    });
  } else {
    const error = new Error("Todo not found");
    error.status = 404;
    return next(error);
  }
};

exports.updateTodo = (req, res, next) => {
  const todoId = parseInt(req.params.id);
  const { title, completed } = req.body;
  const todoIndex = todos.findIndex((t) => t.id === todoId);

  if (todoIndex === -1) {
    const error = new Error("Todo not found");
    error.status = 404;
    return next(error);
  }

  if (
    typeof title !== "string" ||
    typeof completed !== "boolean" ||
    title.trim() === ""
  ) {
    const error = new Error("Invalid request body");
    error.status = 400;
    return next(error);
  }

  todos[todoIndex].title = title;
  todos[todoIndex].completed = completed;

  res.status(200).json({
    success: true,
    data: todos[todoIndex],
  });
};

exports.deleteTodo = (req, res, next) => {
  const todoId = parseInt(req.params.id);
  const todosIndex = todos.findIndex((t) => t.id === todoId);

  if (todosIndex === -1) {
    const error = new Error("Todo not found");
    error.status = 404;
    return next(error);
  }

  const deletedTodo = todos.splice(todosIndex, 1)[0];

  res.status(200).json({
    success: true,
    data: deletedTodo,
  });
};
