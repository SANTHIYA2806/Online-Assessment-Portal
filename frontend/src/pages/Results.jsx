import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results/my")
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      {/* ===== DASHBOARD STYLE WRAPPER ===== */}
      <div className="dashboard-bg">
        <div className="container dashboard-glass mt-4">

          <h3 className="dashboard-title mb-4">My Exam Results</h3>

          {results.length === 0 && (
            <p className="text-muted">No exams attempted yet.</p>
          )}

          <div className="row">
            {results.map(r => (
              <div key={r.id} className="col-md-4 mb-4">
                <div className="exam-card h-100">
                  <h5 className="exam-title">{r.exam_title}</h5>

                  <p className="exam-meta">
                    <b>Score:</b> {r.score}
                  </p>

                  <p className="exam-meta">
                    <b>Status:</b>{" "}
                    <span
                      className={`badge ${
                        r.status === "completed"
                          ? "badge-ready"
                          : "badge-warning"
                      }`}
                    >
                      {r.status}
                    </span>
                  </p>

                  <p className="text-muted mt-3 mb-0">
                    Attempted on:
                    <br />
                    {new Date(r.start_time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

export default Results;
