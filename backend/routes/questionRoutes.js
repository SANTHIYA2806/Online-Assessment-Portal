const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  addQuestion,
  getQuestionsByExam,
  getQuestionCount
} = require("../controllers/questionController");

// ADMIN ONLY
router.post("/:examId", auth(["admin"]), addQuestion);
router.get("/count/:examId", auth(["admin"]), getQuestionCount);

// ADMIN + STUDENT
router.get("/:examId", auth(["admin", "student"]), getQuestionsByExam);

module.exports = router;
