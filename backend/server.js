require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/exams", require("./routes/examRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/results", require("./routes/resultRoutes"));
const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/materials", require("./routes/materialRoutes"));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Multer + upload error handler
app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only document or code files allowed") {
    return res.status(400).json({ message: err.message });
  }

  console.error("UPLOAD ERROR:", err);
  res.status(500).json({ message: "Upload failed" });
});

