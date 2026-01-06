const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const db = require("../config/db");

/**
 * CREATE EXAM (ADMIN)
 * URL: POST /api/exams/create
 */
router.post("/create", auth(["admin"]), async (req, res) => {
  try {
    const {
      title,
      total_questions,
      marks_per_question,
      duration_minutes,
    } = req.body;

    if (
      !title ||
      !total_questions ||
      !marks_per_question ||
      !duration_minutes
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const totalMarks = total_questions * marks_per_question;
    const passMarks = Math.ceil(totalMarks * 0.4); // 40% pass

    await db.query(
      `INSERT INTO exams 
      (title, total_questions, marks_per_question, duration_minutes, total_marks, pass_marks)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        total_questions,
        marks_per_question,
        duration_minutes,
        totalMarks,
        passMarks,
      ]
    );

    res.status(201).json({ message: "Exam created successfully" });
  } catch (err) {
    console.error("CREATE EXAM ERROR:", err);
    res.status(500).json({ message: "Failed to create exam" });
  }
});

/**
 * GET ALL EXAMS (ADMIN + STUDENT)
 */
router.get("/", auth(["admin", "student"]), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM exams ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch exams" });
  }
});

/**
 * ✅ GET AVAILABLE EXAMS (STUDENT ONLY)  ← THIS WAS MISSING
 * URL: GET /api/exams/available
 */
router.get("/available", auth(["student"]), async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        e.id,
        e.title,
        e.duration_minutes,
        ea.status
      FROM exams e
      LEFT JOIN exam_attempts ea
        ON e.id = ea.exam_id AND ea.user_id = ?
      ORDER BY e.id DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error("AVAILABLE EXAMS ERROR:", err);
    res.status(500).json({ message: "Failed to load available exams" });
  }
});

/**
 * START EXAM (STUDENT)
 * URL: POST /api/exams/start/:examId
 */
router.post("/start/:examId", auth(["student"]), async (req, res) => {
  try {
    const userId = req.user.id;
    const { examId } = req.params;

    // check if already attempted
    const [[attempt]] = await db.query(
      "SELECT * FROM exam_attempts WHERE user_id=? AND exam_id=?",
      [userId, examId]
    );

    if (attempt && attempt.status === "completed") {
      return res.status(400).json({ message: "Exam already completed" });
    }

    if (!attempt) {
      await db.query(
        "INSERT INTO exam_attempts (user_id, exam_id, status) VALUES (?, ?, 'in_progress')",
        [userId, examId]
      );
    }

    const [[exam]] = await db.query(
      "SELECT duration_minutes FROM exams WHERE id=?",
      [examId]
    );

    res.json({
      message: "Exam started",
      duration_minutes: exam.duration_minutes
    });

  } catch (err) {
    console.error("START EXAM ERROR:", err);
    res.status(500).json({ message: "Failed to start exam" });
  }
});

module.exports = router;
