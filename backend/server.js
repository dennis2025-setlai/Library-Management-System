
require("dotenv").config();
const transactionsRoutes = require("./routes/transactions");
const usersRoutes = require("./routes/users");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const booksRoutes = require("./routes/books");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/books", booksRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/transactions", transactionsRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Library Management System API is running!");
});

// Test route
app.get("/test", (req, res) => {
  res.send("Test route is working!");
});

// Test MySQL connection
app.get("/api/test-db", async (req, res) => {
  try {
    const [results] = await db.query("SELECT VERSION() AS version");

    res.json({
      message: "MySQL connection successful!",
      version: results[0].version
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Database connection failed."
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
