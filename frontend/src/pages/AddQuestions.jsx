import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function AddQuestions() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState("");

  // ================= FETCH EXAMS =================
  useEffect(() => {
    if (!examId) {
      api.get("/exams")
        .then(res => setExams(res.data))
        .catch(() => alert("Failed to load exams"));
    }
  }, [examId]);

  // ================= SUBMIT QUESTION =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !correct
    ) {
      alert("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        question,
        option_a: optionA,
        option_b: optionB,
        option_c: optionC,
        option_d: optionD,
        correct_option: correct
      };

      await api.post(`/questions/${examId}`, payload);

      alert("✅ Question added successfully");

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrect("");

    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  // ================= SELECT EXAM =================
  if (!examId) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <h3>Select Exam</h3>

          <div className="row">
            {exams.map(exam => (
              <div key={exam.id} className="col-md-4 mb-3">
                <div
                  className="card p-3 shadow"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/add-questions/${exam.id}`)}
                >
                  <h5>{exam.title}</h5>
                  <p>{exam.duration_minutes} mins</p>
                  <button className="btn btn-primary btn-sm">
                    Add Questions →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // ================= ADD QUESTION FORM =================
  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3>Add Questions for Assessment</h3>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Option A"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Option B"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Option C"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            required
          />

          <input
            className="form-control mb-2"
            placeholder="Option D"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            required
          />

          <select
            className="form-select mb-3"
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            required
          >
            <option value="">Select Correct Answer</option>
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>

          <button
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Question"}
          </button>
        </form>
      </div>
    </>
  );
}

export default AddQuestions;
