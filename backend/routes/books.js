
const express = require("express");
const router = express.Router();
const db = require("../db");

// TEST: Check if Books router is working
router.get("/test", (req, res) => {
  res.send("Books router is working!");
});

// GET: Retrieve all books
router.get("/", async (req, res) => {
  try {
    const [books] = await db.query("SELECT * FROM books");
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve books."
    });
  }
});

// POST: Add a new book
router.post("/", async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !genre?.trim() ||
      !isbn?.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid book details."
      });
    }

    const [result] = await db.query(
      "INSERT INTO books (title, author, genre, isbn, quantity) VALUES (?, ?, ?, ?, ?)",
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), quantity]
    );

    res.status(201).json({
      message: "Book added successfully!",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to add book."
    });
  }
});

// PUT: Update an existing book
router.put("/:id", async (req, res) => {
  try {
    const { title, author, genre, isbn, quantity } = req.body;
    const { id } = req.params;

    if (
      !title?.trim() ||
      !author?.trim() ||
      !genre?.trim() ||
      !isbn?.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      return res.status(400).json({
        message: "Please provide valid book details."
      });
    }

    const [result] = await db.query(
      "UPDATE books SET title = ?, author = ?, genre = ?, isbn = ?, quantity = ? WHERE id = ?",
      [title.trim(), author.trim(), genre.trim(), isbn.trim(), quantity, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    res.json({
      message: "Book updated successfully!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update book."
    });
  }
});

// DELETE: Remove a book
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM books WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Book not found."
      });
    }

    res.json({
      message: "Book deleted successfully!"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete book."
    });
  }
});

module.exports = router;
