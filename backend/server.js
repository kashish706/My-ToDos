// server.js
const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        /^http:\/\/localhost(:\d+)?$/.test(origin) ||
        /\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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