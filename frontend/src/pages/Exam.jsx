import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Exam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [blockMessage, setBlockMessage] = useState("");

  // ================= LOAD EXAM =================
  useEffect(() => {
    const loadExam = async () => {
      try {
        const startRes = await api.post(`/exams/start/${id}`);
        setTimeLeft(startRes.data.duration_minutes * 60);

        const qRes = await api.get(`/questions/${id}`);
        setQuestions(qRes.data);
      } catch (err) {
        setBlocked(true);
        setBlockMessage(err.response?.data?.message || "Exam unavailable");
      }
    };

    loadExam();
  }, [id]);

  // ================= SUBMIT =================
  const submitExam = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);

    const payload = {
      examId: Number(id),
      answers: Object.keys(answers).map(qid => ({
        question_id: Number(qid),
        selected: answers[qid].toUpperCase()
      }))
    };

    try {
      await api.post("/results/submit", payload);
      navigate("/results/my");
    } catch {
      navigate("/results/my");
    }
  }, [answers, id, submitted, navigate]);

  // ================= TIMER =================
  useEffect(() => {
    if (!questions.length || submitted) return;

    if (timeLeft <= 0) {
      submitExam();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, questions.length, submitExam]);

  // ================= BLOCKED =================
  if (blocked) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 text-center">
          <h4 className="text-danger">{blockMessage}</h4>
          <button className="btn btn-primary mt-3" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
      </>
    );
  }

  if (!questions.length) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">Loading exam...</div>
      </>
    );
  }

  const q = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="d-flex justify-content-between">
          <h5>Question {current + 1} / {questions.length}</h5>
          <h5 className="text-danger">⏱ {minutes}:{seconds.toString().padStart(2, "0")}</h5>
        </div>

        <div className="card p-3 mt-3">
          <p className="fw-bold">{q.question_text}</p>

          {["a", "b", "c", "d"].map(opt => (
            <div className="form-check" key={opt}>
              <input
                className="form-check-input"
                type="radio"
                name={`q-${q.id}`}
                checked={answers[q.id] === opt}
                onChange={() =>
                  setAnswers(prev => ({ ...prev, [q.id]: opt }))
                }
              />
              <label className="form-check-label">
                {q[`option_${opt}`]}
              </label>
            </div>
          ))}
        </div>

        {/* ================= BUTTONS ================= */}
        <div className="mt-3">
          <button
            className="btn btn-secondary me-2"
            disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}
          >
            Previous
          </button>

          <button
            className="btn btn-primary me-2"
            disabled={current === questions.length - 1}
            onClick={() => setCurrent(c => c + 1)}
          >
            Next
          </button>

          <button
            className="btn btn-success"
            onClick={submitExam}
          >
            Submit Exam
          </button>
        </div>
      </div>
    </>
  );
}

export default Exam;
