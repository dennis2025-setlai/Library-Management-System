
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET: Retrieve all users
router.get("/", async (req, res) => {
  try {
    const [users] = await db.query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users." });
  }
});

// POST: Add a new user
router.post("/", async (req, res) => {
  try {
    const { name, membership_id, role } = req.body;

    if (
      !name?.trim() ||
      !membership_id?.trim() ||
      !["Member", "Admin"].includes(role)
    ) {
      return res.status(400).json({
        message: "Please provide valid user details."
      });
    }

    const [result] = await db.query(
      "INSERT INTO users (name, membership_id, role) VALUES (?, ?, ?)",
      [name.trim(), membership_id.trim(), role]
    );

    res.status(201).json({
      message: "User added successfully!",
      id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add user." });
  }
});

// PUT: Update an existing user
router.put("/:id", async (req, res) => {
  try {
    const { name, membership_id, role } = req.body;

    if (
      !name?.trim() ||
      !membership_id?.trim() ||
      !["Member", "Admin"].includes(role)
    ) {
      return res.status(400).json({
        message: "Please provide valid user details."
      });
    }

    const [result] = await db.query(
      "UPDATE users SET name = ?, membership_id = ?, role = ? WHERE id = ?",
      [name.trim(), membership_id.trim(), role, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User updated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user." });
  }
});

// DELETE: Remove a user
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

module.exports = router;
