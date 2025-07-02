const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Test route to check if passes routes are working
router.get('/test', (req, res) => {
  res.json({ message: "Passes route is working" });
});

// GET all passes (without zone info)
router.get("/visitor-pass-info", async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT p.*, v.*
      FROM passes p
      JOIN visitors v ON p.visitor_id = v.id
      ORDER BY p.created_on DESC
    `);

    const passes = rows.map(row => ({
      ...row,
      visitor: {
        id: row.visitor_id,
        first_name: row.first_name,
        last_name: row.last_name,
        visitor_type: row.visitor_type,
        image: row.image
      }
    }));

    res.status(200).json(passes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch passes" });
  }
});

// POST create new pass (no key, no zones)
router.post("/visitor-pass-info", async (req, res) => {
  const {
    visitor, valid_until,
    visiting_purpose, whom_to_visit,
    visiting_department
  } = req.body;

  try {
    const [result] = await db.promise().query(`
      INSERT INTO passes 
        (visitor_id, valid_until, visiting_purpose, whom_to_visit, visiting_department, created_on) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [visitor, valid_until, visiting_purpose, whom_to_visit, visiting_department]);

    const passId = result.insertId;

    // Fetch the created pass
    const [rows] = await db.promise().query(`
      SELECT p.*, v.*
      FROM passes p
      JOIN visitors v ON p.visitor_id = v.id
      WHERE p.id = ?
    `, [passId]);

    const row = rows[0];
    const createdPass = {
      ...row,
      visitor: {
        id: row.visitor_id,
        first_name: row.first_name,
        last_name: row.last_name,
        visitor_type: row.visitor_type,
        image: row.image
      }
    };

    res.status(201).json(createdPass);
  } catch (err) {
    res.status(500).json({ error: "Failed to create pass" });
  }
});

// POST overwrite existing pass (no key, no zones)
router.post("/visitor-pass-info/overwrite", async (req, res) => {
  const {
    visitor, valid_until,
    visiting_purpose, whom_to_visit,
    visiting_department
  } = req.body;

  try {
    // You may choose a different condition to delete old passes
    // For now, we'll skip deletion logic since `key_id` was used

    const [result] = await db.promise().query(`
      INSERT INTO passes 
        (visitor_id, valid_until, visiting_purpose, whom_to_visit, visiting_department, created_on) 
      VALUES (?, ?, ?, ?, ?, NOW())
    `, [visitor, valid_until, visiting_purpose, whom_to_visit, visiting_department]);

    res.status(201).json({ message: "Pass overwritten successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to overwrite pass" });
  }
});

// GET last registered visitor using key (removed since key no longer exists)
router.get("/view-last-registered-visitor/:keyId", (req, res) => {
  res.status(410).json({ error: "Key-based lookup is no longer supported" });
});

module.exports = router;
