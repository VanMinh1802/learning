const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());

let todos = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Write first test", completed: true },
];

let nextId = 3;

/*
2. POST /todos
Purpose: Create a new todo.

Request:
POST /api/todos
Content-Type: application/json
*/
app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Title is required",
      },
    });
  }

  const newTodo = {
    id: nextId++,
    title: title,
    completed: false,
  };

  todos.push(newTodo);

  console.log("Todo list updated: ", todos);

  res.status(201).json({
    success: true,
    data: newTodo,
  });
});

/*
1. GET /todos
Purpose: Retrieve all todos.

Request:
GET /api/todos
*/
app.get("/api/todos", (req, res) => {
  res.status(200).json({
    success: true,
    data: todos,
  });
});

/*
3. GET /todos/:id
Purpose: Retrieve a specific todo by ID.

Request:
GET /api/todos/1
*/
app.get("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Todo not found",
      },
    });
  }

  res.status(200).json({
    success: true,
    data: todo,
  });
});

/*
4. PUT /todos/:id
Purpose: Update a specific todo.

Request:
PUT /api/todos/1
Content-Type: application/json
*/
app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Todo not found",
      },
    });
  }

  const { title, completed } = req.body;
  if (
    typeof title !== "string" ||
    typeof completed !== "boolean" ||
    title.trim() === ""
  ) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
      },
    });
  }

  todos[index].title = title;
  todos[index].completed = completed;

  console.log("Todo list updated: ", todos);

  res.status(200).json({
    success: true,
    data: todos[index],
  });
});

/* 
5. DELETE /todos/:id
Purpose: Delete a specific todo.

Request:
DELETE /api/todos/2
*/
app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Todo not found",
      },
    });
  }

  const deleteTodo = todos.splice(index, 1)[0];

  console.log("Todo list updated: ", todos);

  res.status(200).json({
    success: true,
    data: deleteTodo,
  });
});

app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
