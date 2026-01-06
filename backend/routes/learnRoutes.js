const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getResources } = require("../controllers/learnController");

router.get("/:examId", auth(["student", "admin"]), getResources);

module.exports = router;
