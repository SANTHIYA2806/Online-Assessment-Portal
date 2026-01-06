const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyResults,
  getAllResults,
  submitResult
} = require("../controllers/resultController");

// student submits exam
router.post("/submit", auth(["student"]), submitResult);

// student → only own results
router.get("/my", auth(["student"]), getMyResults);

// admin → all student results
router.get("/", auth(["admin"]), getAllResults);

module.exports = router;
