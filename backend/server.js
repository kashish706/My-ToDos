// server.js
// Main Express server entry point

const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({ origin: "http://localhost:5173" })); // Allow Vite dev server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use("/api/todos", todoRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Todo API is running." });
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
