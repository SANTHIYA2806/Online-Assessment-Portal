const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const auth = require("../middleware/authMiddleware");
const db = require("../config/db");

/* ================= GET MATERIALS (ADMIN + STUDENT) ================= */
router.get(
  "/",
  auth(["admin", "student"]),   // ✅ FIXED
  async (req, res) => {
    const { exam } = req.query;

    if (!exam) {
      return res.status(400).json({ message: "Exam ID required" });
    }

    try {
      const [rows] = await db.query(
        "SELECT id, title, link FROM materials WHERE exam_id = ?",
        [exam]
      );

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  }
);

/* ================= UPLOAD MATERIAL (ADMIN ONLY) ================= */
router.post(
  "/",
  auth(["admin"]),              // ✅ FIXED
  upload.single("file"),
  async (req, res) => {
    try {
      const { title, examId } = req.body;

      if (!req.file) {
        return res.status(400).json({ message: "File missing" });
      }

      await db.query(
        "INSERT INTO materials (exam_id, title, link) VALUES (?, ?, ?)",
        [examId, title, req.file.filename]
      );

      res.json({ message: "Material uploaded successfully" });
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

module.exports = router;
