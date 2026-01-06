const db = require("../config/db");

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, examId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File not received" });
    }

    await db.query(
      `INSERT INTO materials (exam_id, title, file_path)
       VALUES (?, ?, ?)`,
      [examId, title, req.file.filename]
    );

    res.json({ message: "Material uploaded successfully" });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

exports.getMaterials = async (req, res) => {
  const { examId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM materials WHERE exam_id = ?",
    [examId]
  );

  res.json(rows);
};
