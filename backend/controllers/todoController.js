// controllers/todoController.js
// Handles all business logic for Todo CRUD operations

const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const DATA_FILE = path.join(__dirname, "../data/todos.json");

// --- Helpers ---

/** Read all todos from JSON file */
const readTodos = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist yet, return empty array
    if (err.code === "ENOENT") return [];
    throw err;
  }
};

/** Write todos array to JSON file */
const writeTodos = async (todos) => {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), "utf-8");
};

/** Validate incoming todo fields */
const validateTodo = (body) => {
  const errors = [];
  if (!body.title || body.title.trim() === "") {
    errors.push("Title is required.");
  }
  const validPriorities = ["Low", "Medium", "High"];
  if (!body.priority || !validPriorities.includes(body.priority)) {
    errors.push("Priority must be one of: Low, Medium, High.");
  }
  return errors;
};

// --- Controllers ---

/**
 * GET /api/todos
 * Returns all todos
 */
const getAllTodos = async (req, res, next) => {
  try {
    const todos = await readTodos();
    res.json({ success: true, count: todos.length, data: todos });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/todos/:id
 * Returns a single todo by ID
 */
const getTodoById = async (req, res, next) => {
  try {
    const todos = await readTodos();
    const todo = todos.find((t) => t.id === req.params.id);
    if (!todo) {
      const err = new Error("Todo not found.");
      err.statusCode = 404;
      return next(err);
    }
    res.json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/todos
 * Creates a new todo
 */
const createTodo = async (req, res, next) => {
  try {
    const errors = validateTodo(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const newTodo = {
      id: uuidv4(),
      title: req.body.title.trim(),
      description: req.body.description?.trim() || "",
      priority: req.body.priority,
      status: req.body.status || "Pending",
      dueDate: req.body.dueDate || null,
      createdAt: new Date().toISOString(),
    };

    const todos = await readTodos();
    todos.unshift(newTodo); // newest first
    await writeTodos(todos);

    res.status(201).json({ success: true, data: newTodo });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/todos/:id
 * Updates an existing todo
 */
const updateTodo = async (req, res, next) => {
  try {
    const todos = await readTodos();
    const idx = todos.findIndex((t) => t.id === req.params.id);
    if (idx === -1) {
      const err = new Error("Todo not found.");
      err.statusCode = 404;
      return next(err);
    }

    // Validate if title or priority fields are being updated
    const merged = { ...todos[idx], ...req.body };
    const errors = validateTodo(merged);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const updatedTodo = {
      ...todos[idx],
      title: req.body.title?.trim() ?? todos[idx].title,
      description:
        req.body.description !== undefined
          ? req.body.description.trim()
          : todos[idx].description,
      priority: req.body.priority ?? todos[idx].priority,
      status: req.body.status ?? todos[idx].status,
      dueDate:
        req.body.dueDate !== undefined ? req.body.dueDate : todos[idx].dueDate,
    };

    todos[idx] = updatedTodo;
    await writeTodos(todos);

    res.json({ success: true, data: updatedTodo });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/todos/:id
 * Deletes a todo by ID
 */
const deleteTodo = async (req, res, next) => {
  try {
    const todos = await readTodos();
    const idx = todos.findIndex((t) => t.id === req.params.id);
    if (idx === -1) {
      const err = new Error("Todo not found.");
      err.statusCode = 404;
      return next(err);
    }

    todos.splice(idx, 1);
    await writeTodos(todos);

    res.json({ success: true, message: "Todo deleted successfully." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
