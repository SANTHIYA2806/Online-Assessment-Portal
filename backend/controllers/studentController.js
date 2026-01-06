const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        e.id AS exam_id,
        e.title,
        e.total_marks,
        r.score,
        CASE
          WHEN r.id IS NOT NULL THEN 'completed'
          WHEN a.id IS NOT NULL THEN 'in_progress'
          ELSE 'not_started'
        END AS status
      FROM exams e
      LEFT JOIN exam_attempts a 
        ON e.id = a.exam_id AND a.user_id = ?
      LEFT JOIN results r 
        ON e.id = r.exam_id AND r.user_id = ?
    `, [userId, userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};
