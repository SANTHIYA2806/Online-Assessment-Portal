const db = require("../config/db");

exports.createExam = async (req, res) => {
  try {
    const {
      title,
      total_questions,
      marks_per_question,
      duration_minutes
    } = req.body;

    if (!title || !total_questions || !marks_per_question || !duration_minutes) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const total_marks = total_questions * marks_per_question;

    await db.query(
      `INSERT INTO exams 
      (title, total_questions, marks_per_question, duration_minutes, total_marks, pass_marks)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        total_questions,
        marks_per_question,
        duration_minutes,
        total_marks,
        pass_marks
      ]
    );

    res.json({ message: "Exam created successfully" });
  } catch (err) {
    console.error("CREATE EXAM ERROR:", err.sqlMessage || err.message);
    res.status(500).json({ message: "Failed to create exam" });
  }
};

exports.getExams = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM exams");
  res.json(rows);
};

exports.getAvailableExams = async (req, res) => {
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
  `, [userId]);

  res.json(rows);
};


/* START EXAM */
exports.startExam = async (req, res) => {
  const userId = req.user.id;
  const { examId } = req.params;

  // Check if attempt exists
  const [rows] = await db.query(
    "SELECT * FROM exam_attempts WHERE user_id=? AND exam_id=?",
    [userId, examId]
  );

  if (rows.length > 0) {
    if (rows[0].status === "completed") {
      return res.status(400).json({
        message: "Exam already submitted"
      });
    }

    // already started → allow resume
    return res.json({
      message: "Exam resumed",
      duration_minutes: rows[0].duration_minutes || 30
    });
  }

  // Create new attempt ONLY ON FIRST TIME
  await db.query(
    `INSERT INTO exam_attempts (user_id, exam_id, status)
     VALUES (?, ?, 'in_progress')`,
    [userId, examId]
  );

  const [[exam]] = await db.query(
    "SELECT duration_minutes FROM exams WHERE id=?",
    [examId]
  );

  res.json({
    message: "Exam started",
    duration_minutes: exam.duration_minutes
  });
};
