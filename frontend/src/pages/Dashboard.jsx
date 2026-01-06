import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const startExam = async (examId) => {
  try {
    await api.post(`/exams/start/${examId}`);
    navigate(`/exam/${examId}`);
  } catch (err) {
    console.error("Start exam failed:", err);
    alert(err.response?.data?.message || "Failed to start exam");
  }
};

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const url = role === "admin" ? "/exams" : "/exams/available";
        const res = await api.get(url);
        setExams(res.data || []);
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [role]);

  return (
    <>
      <Navbar />

      <div className="dashboard-bg">
        <div className="container dashboard-glass mt-4">

          <h3 className="mb-4 dashboard-title">
            {role === "admin" ? "Admin Dashboard" : "Student Dashboard"}
          </h3>

          {/* ================= ADMIN ACTIONS ================= */}
          {role === "admin" && (
            <div className="mb-4 d-flex gap-3 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/create-exam")}
              >
                ➕ Create Exam
              </button>

              <button
                className="btn btn-dark"
                onClick={() => navigate("/results")}
              >
                📊 View All Results
              </button>
            </div>
          )}

          {/* ================= STUDENT ACTION ================= */}
          {role === "student" && (
            <div className="mb-4">
              <button
                className="btn btn-dark"
                onClick={() => navigate("/results/my")}
              >
                📊 View My Results
              </button>
            </div>
          )}

          {loading && <p>Loading exams...</p>}

          {!loading && exams.length === 0 && (
            <p className="text-muted">No exams available.</p>
          )}

          {/* ================= EXAM CARDS ================= */}
          <div className="row">
            {exams.map((exam) => {
              const noQuestions = exam.questionCount === 0;
              const disableStudent = role === "student" && noQuestions;

              return (
                <div key={exam.id} className="col-md-4 mb-4">
                  <div
                    className={`exam-card h-100 ${
                      disableStudent ? "disabled-card" : ""
                    }`}
                  >
                    <div className="d-flex flex-column h-100">

                      <div>
                        <h5 className="exam-title">{exam.title}</h5>

                        <p className="exam-meta">
                          Duration: <b>{exam.duration_minutes}</b> minutes
                        </p>

                        <p className="exam-meta">
                          Questions: <b>{exam.questionCount}</b>
                        </p>

                        {/* ===== STATUS BADGE ===== */}
                        {noQuestions ? (
                          <span className="badge badge-warning">
                            Questions not uploaded
                          </span>
                        ) : (
                          <span className="badge badge-ready">
                            Ready
                          </span>
                        )}
                      </div>

                      {/* ================= ADMIN BUTTONS ================= */}
                      {role === "admin" && (
                        <div className="d-flex gap-2 mt-auto">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              navigate(`/add-questions/${exam.id}`)
                            }
                          >
                            Add Questions
                          </button>

                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() =>
                              navigate(`/materials?exam=${exam.id}`)
                            }
                          >
                            Upload Materials
                          </button>
                        </div>
                      )}

                      {/* ================= STUDENT BUTTONS ================= */}
{role === "student" && (
  <div className="d-flex flex-column gap-2 mt-auto">

    <button
      className="btn btn-start"
      disabled={disableStudent}
      onClick={() => startExam(exam.id)}
    >
      ▶ Start Exam
    </button>

    <button
      className="btn btn-material"
      onClick={() => navigate(`/materials?exam=${exam.id}`)}
    >
      📘 View Materials
    </button>

  </div>
)}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
