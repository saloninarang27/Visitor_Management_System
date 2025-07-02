const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Example endpoint: GET /reports/visitor?start_date=2024-01-01&end_date=2024-01-31
router.get("/visitor", async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT v.first_name, v.last_name, v.phone, v.visitor_type, 
              v.gov_id_type, v.gov_id_no, v.image, p.created_on AS pass_created_on
       FROM visitors v
       LEFT JOIN passes p ON v.id = p.visitor_id
       WHERE p.created_on BETWEEN ? AND ?
       ORDER BY p.created_on DESC`,
      [start_date, end_date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// GET /reports/user
router.get("/user", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, username, user_type, image FROM users`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /reports/user_session/:userId
router.get("/user_session/:userId", async (req, res) => {
  const { userId } = req.params;
  const { start_date, end_date } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT * FROM user_sessions
       WHERE user_id = ? AND login_time BETWEEN ? AND ?`,
      [userId, start_date, end_date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET /reports/key-assigned/:keyId
router.get("/key-assigned/:keyId", async (req, res) => {
  const { keyId } = req.params;
  const { start_date, end_date } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT * FROM key_assignments 
       WHERE key_id = ? AND assigned_on BETWEEN ? AND ?`,
      [keyId, start_date, end_date]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
