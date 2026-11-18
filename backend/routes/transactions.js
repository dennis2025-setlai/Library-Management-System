
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET: Retrieve all transactions
router.get("/", async (req, res) => {
  try {
    const [transactions] = await db.query(`
      SELECT
        transactions.id,
        transactions.book_id,
        books.title AS book_title,
        transactions.type,
        transactions.quantity,
        transactions.transaction_date
      FROM transactions
      JOIN books ON transactions.book_id = books.id
      ORDER BY transactions.transaction_date DESC
    `);

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve transactions."
    });
  }
});

// POST: Record a transaction
router.post("/", async (req, res) => {
  const { book_id, type, quantity } = req.body;

  if (
    !Number.isInteger(book_id) ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    !["Borrow", "Return", "Add Stock"].includes(type)
  ) {
    return res.status(400).json({
      message: "Please provide valid transaction details."
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [books] = await connection.query(
      "SELECT * FROM books WHERE id = ? FOR UPDATE",
      [book_id]
    );

    if (books.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Book not found." });
    }

    const book = books[0];
    let newQuantity = book.quantity;

    if (type === "Borrow") {
      if (book.quantity < quantity) {
        await connection.rollback();
        return res.status(400).json({
          message: "Not enough books available."
        });
      }

      newQuantity -= quantity;
    } else if (type === "Return") {
      newQuantity += quantity;
    } else if (type === "Add Stock") {
      newQuantity += quantity;
    }

    await connection.query(
      "UPDATE books SET quantity = ? WHERE id = ?",
      [newQuantity, book_id]
    );

    const [result] = await connection.query(
      "INSERT INTO transactions (book_id, type, quantity) VALUES (?, ?, ?)",
      [book_id, type, quantity]
    );

    await connection.commit();

    res.status(201).json({
      message: "Transaction recorded successfully!",
      transaction_id: result.insertId,
      updated_quantity: newQuantity
    });

  } catch (error) {
    if (connection) await connection.rollback();

    console.error(error);

    res.status(500).json({
      message: "Failed to record transaction."
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
