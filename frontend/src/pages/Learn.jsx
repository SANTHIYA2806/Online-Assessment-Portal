import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Learn() {
  const { id } = useParams();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    api.get(`/learn/${id}`)
      .then(res => setResources(res.data))
      .catch(() => alert("Failed to load resources"));
  }, [id]);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3 className="mb-3">Learning Resources</h3>

        {resources.length === 0 && (
          <p>No learning materials added yet.</p>
        )}

        <div className="list-group">
          {resources.map(r => (
            <a
              key={r.id}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="list-group-item list-group-item-action"
            >
              📘 {r.title}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default Learn;
