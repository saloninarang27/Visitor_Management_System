const express = require("express");
const router = express.Router();
const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Middleware for JWT verification
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// 1. Pass Time Left Today
router.get("/pass-time-left", verifyToken, (req, res) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const query = `
        SELECT v.first_name, v.last_name, v.phone, v.gov_id_type, v.gov_id_no, v.image,
               p.created_on AS pass_created_at, p.valid_until
        FROM visitors v
        JOIN passes p ON v.id = p.visitor_id
        WHERE DATE(p.created_on) = ?
    `;
    db.query(query, [today], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const formatted = results.map(row => ({
            visitor_name: `${row.first_name} ${row.last_name}`,
            phone: row.phone,
            gov_id_type: row.gov_id_type,
            gov_id_no: row.gov_id_no,
            image: row.image,
            pass_created_at: row.pass_created_at,
            valid_upto: row.valid_until
        }));
        res.json(formatted);
    });
});

// 2. Today's Visitor Count by Time Slots (per 30 minutes)
router.get("/today-visitor-visit", verifyToken, (req, res) => {
    const today = new Date().toISOString().split("T")[0];

    const query = `
        SELECT DATE_FORMAT(created_on, '%Y-%m-%d %H:%i:00') as timeslot, COUNT(*) as count
        FROM passes
        WHERE DATE(created_on) = ?
        GROUP BY timeslot
    `;
    db.query(query, [today], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const result = {};
        results.forEach(r => {
            result[r.timeslot] = r.count;
        });
        res.json(result);
    });
});

// 3. Weekly Visitor Count (Last 7 Days)
router.get("/weekly-visitor-visit", verifyToken, (req, res) => {
    const query = `
        SELECT DATE_FORMAT(created_on, '%W') as weekday, COUNT(*) as count
        FROM passes
        WHERE created_on >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY weekday
        ORDER BY FIELD(weekday, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const result = {};
        results.forEach(r => {
            result[r.weekday] = r.count;
        });
        res.json(result);
    });
});

// 4. Visitor in Zones (grouped by visiting_department)
router.get("/visitor-in-zone", verifyToken, (req, res) => {
    const query = `
        SELECT visiting_department, COUNT(*) as count
        FROM passes
        WHERE DATE(created_on) = CURDATE()
        GROUP BY visiting_department
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const result = {};
        results.forEach(r => {
            result[r.visiting_department] = r.count;
        });
        res.json(result);
    });
});

module.exports = router;
