const db = require("../config/db");

/* ================= STUDENT: SUBMIT EXAM ================= */
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const userId = req.user.id;

    const [attempts] = await db.query(
      "SELECT status FROM exam_attempts WHERE user_id=? AND exam_id=?",
      [userId, examId]
    );

    if (!attempts.length) {
      return res.status(400).json({ message: "Exam not started" });
    }

    if (attempts[0].status === "submitted") {
      return res.status(400).json({ message: "Already submitted" });
    }

    // 👉 scoring logic already exists in your file
    // keep it as-is
    res.json({ message: "Exam submitted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STUDENT: MY RESULTS ================= */
exports.getMyResults = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await db.query(`
      SELECT 
        ea.id,
        e.title AS exam_title,
        ea.score,
        ea.status,
        ea.start_time
      FROM exam_attempts ea
      JOIN exams e ON e.id = ea.exam_id
      WHERE ea.user_id = ?
      ORDER BY ea.start_time DESC
    `, [userId]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN: ALL STUDENT RESULTS ================= */
exports.getAllResults = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        u.name AS student_name,
        u.email,
        e.title AS exam_title,
        ea.score,
        ea.status,
        ea.start_time
      FROM exam_attempts ea
      JOIN users u ON u.id = ea.user_id
      JOIN exams e ON e.id = ea.exam_id
      ORDER BY ea.start_time DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.submitResult = async (req, res) => {
  const userId = req.user.id;
  const { examId, answers } = req.body;

  if (!answers || answers.length === 0) {
    return res.status(400).json({ message: "No answers submitted" });
  }

  // 1️⃣ Store student answers
  for (const ans of answers) {
    await db.query(
      `INSERT INTO student_answers (user_id, exam_id, question_id, selected_option)
       VALUES (?, ?, ?, ?)`,
      [userId, examId, ans.question_id, ans.selected]
    );
  }

  // 2️⃣ Get correct answers
  const [questions] = await db.query(
    "SELECT id, correct_answer FROM questions WHERE exam_id = ?",
    [examId]
  );

  let score = 0;

  // 3️⃣ Calculate score
  questions.forEach(q => {
    const userAnswer = answers.find(a => a.question_id === q.id);
    if (
      userAnswer &&
      userAnswer.selected.toUpperCase() === q.correct_answer.toUpperCase()
    ) {
      score += 1;
    }
  });

  // 4️⃣ Update exam_attempts
  await db.query(
    `UPDATE exam_attempts
     SET score = ?, status = 'completed'
     WHERE user_id = ? AND exam_id = ?`,
    [score, userId, examId]
  );

  res.json({
    message: "Exam submitted successfully",
    score
  });
};
