const db = require("../config/db");

exports.getResources = async (req, res) => {
  const examId = req.params.examId;

  const [rows] = await db.query(
    "SELECT * FROM learning_resources WHERE exam_id = ?",
    [examId]
  );

  res.json(rows);
};
