const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const studentController = require("../controllers/studentController");

router.get("/dashboard", auth(["student"]), studentController.getDashboard);

module.exports = router;
