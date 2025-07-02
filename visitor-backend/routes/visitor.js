const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

// Create new visitor
router.post('/visitor-info', authenticateToken, (req, res) => {
  const {
    first_name, last_name, phone, address, email,
    blood_group, visitor_type, gov_id_type, gov_id_no,
    image, signature
  } = req.body;

  const sql = `INSERT INTO visitors (first_name, last_name, phone, address, email, blood_group, visitor_type, gov_id_type, gov_id_no, image, signature) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [first_name, last_name, phone, address, email, blood_group, visitor_type, gov_id_type, gov_id_no, image, signature], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error while adding visitor' });
    res.status(201).json({ id: result.insertId });
  });
});

// Get visitors list with search and pagination
router.get('/visitor-info', authenticateToken, (req, res) => {
  const { first_name__icontains, last_name__icontains, phone__icontains, gov_id_no__icontains, offset = 0, limit = 10 } = req.query;

  let baseQuery = `SELECT * FROM visitors WHERE 1=1`;
  const values = [];

  if (first_name__icontains) {
    baseQuery += ` AND first_name LIKE ?`;
    values.push(`%${first_name__icontains}%`);
  }
  if (last_name__icontains) {
    baseQuery += ` AND last_name LIKE ?`;
    values.push(`%${last_name__icontains}%`);
  }
  if (phone__icontains) {
    baseQuery += ` AND phone LIKE ?`;
    values.push(`%${phone__icontains}%`);
  }
  if (gov_id_no__icontains) {
    baseQuery += ` AND gov_id_no LIKE ?`;
    values.push(`%${gov_id_no__icontains}%`);
  }

  const countQuery = `SELECT COUNT(*) AS count FROM (${baseQuery}) as temp`;
  db.query(countQuery, values, (err, countResult) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    baseQuery += ` LIMIT ?, ?`;
    values.push(parseInt(offset), parseInt(limit));

    db.query(baseQuery, values, (err, data) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json({ results: data, count: countResult[0].count });
    });
  });
});

// Update visitor by id
router.patch('/visitor-info/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const {
    first_name, last_name, phone, address, email,
    blood_group, visitor_type, gov_id_type, gov_id_no,
    image, signature
  } = req.body;

  const sql = `UPDATE visitors SET first_name=?, last_name=?, phone=?, address=?, email=?, blood_group=?, visitor_type=?, gov_id_type=?, gov_id_no=?, image=?, signature=? WHERE id=?`;

  db.query(sql, [first_name, last_name, phone, address, email, blood_group, visitor_type, gov_id_type, gov_id_no, image, signature, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error while updating visitor' });

    res.json({ message: 'Visitor updated successfully' });
  });
});

// Delete visitor
router.delete('/visitor-info/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // First, check if the visitor exists
  const checkQuery = 'SELECT * FROM visitors WHERE id = ?';
  db.query(checkQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error while checking visitor' });

    if (result.length === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    // Proceed with deletion if visitor exists
    const sql = `DELETE FROM visitors WHERE id = ?`;
    db.query(sql, [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error while deleting visitor' });

      res.json({ message: 'Visitor deleted successfully' });
    });
  });
});

module.exports = router;
