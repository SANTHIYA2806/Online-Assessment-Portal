import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function CreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [marksPerQuestion, setMarksPerQuestion] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: title.trim(),
        total_questions: Number(totalQuestions),
        marks_per_question: Number(marksPerQuestion),
        duration_minutes: Number(duration),
      };

      console.log("CREATE EXAM PAYLOAD:", payload);

      // ✅ FIXED URL
      await api.post("/exams/create", payload);

      alert("✅ Exam created successfully");
      navigate("/dashboard");
    } catch (err) {
      console.error("Create exam failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-bg">
        <div className="container dashboard-glass mt-4">
          <h3 className="dashboard-title mb-3">Create Exam</h3>

          <div className="exam-form-card">
            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Exam Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Total Questions</label>
                <input
                  type="number"
                  className="form-control"
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Marks per Question</label>
                <input
                  type="number"
                  className="form-control"
                  value={marksPerQuestion}
                  onChange={(e) => setMarksPerQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Creating Exam..." : "Create Exam"}
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateExam;
