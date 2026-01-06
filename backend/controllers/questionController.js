const db = require("../config/db");

/* ADD QUESTION WITH LIMIT CHECK */
exports.addQuestion = async (req, res) => {
  const { examId } = req.params;
  const {
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_option
  } = req.body;

  const [[exam]] = await db.query(
    "SELECT total_questions FROM exams WHERE id=?",
    [examId]
  );

  if (!exam) {
    return res.status(404).json({ message: "Exam not found" });
  }

  const [[countRow]] = await db.query(
    "SELECT COUNT(*) AS count FROM questions WHERE exam_id=?",
    [examId]
  );

  if (countRow.count >= exam.total_questions) {
    return res.status(400).json({
      message: `Only ${exam.total_questions} questions allowed`
    });
  }

  await db.query(
    `INSERT INTO questions
     (exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [examId, question, option_a, option_b, option_c, option_d, correct_option]
  );

  res.json({ message: "Question added successfully" });
};

/* GET QUESTIONS BY EXAM */
exports.getQuestionsByExam = async (req, res) => {
  const { examId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM questions WHERE exam_id = ?",
    [examId]
  );

  res.json(rows);
};

/* COUNT QUESTIONS */
exports.getQuestionCount = async (req, res) => {
  const { examId } = req.params;

  const [[row]] = await db.query(
    "SELECT COUNT(*) AS count FROM questions WHERE exam_id = ?",
    [examId]
  );

  res.json(row);
};
