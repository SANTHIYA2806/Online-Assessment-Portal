import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function AdminResults() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    api.get("/results")
      .then(res => setResults(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />

      {/* ===== DASHBOARD STYLE WRAPPER ===== */}
      <div className="dashboard-bg">
        <div className="container dashboard-glass mt-4">

          <h3 className="dashboard-title mb-4">All Student Results</h3>

          {results.length === 0 && (
            <p className="text-muted">No exam attempts found.</p>
          )}

          <div className="row">
            {results.map((r) => {
              const pass = r.score >= 1;

              return (
                <div key={r.id} className="col-md-4 mb-4">
                  <div className="exam-card h-100">
                    <h5 className="exam-title">{r.exam_title}</h5>

                    <p className="exam-meta">
                      <b>Student:</b> {r.student_name}
                    </p>

                    <p className="exam-meta">
                      <b>Score:</b> {r.score}
                    </p>

                    <p className="exam-meta">
                      <b>Status:</b>{" "}
                      <span
                        className={`badge ${
                          pass ? "badge-ready" : "badge-danger"
                        }`}
                      >
                        {pass ? "PASS" : "FAIL"}
                      </span>
                    </p>

                    <p className="text-muted mt-3 mb-0">
                      Attempted on:
                      <br />
                      {new Date(r.start_time).toLocaleString()}
                    </p>
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

export default AdminResults;
