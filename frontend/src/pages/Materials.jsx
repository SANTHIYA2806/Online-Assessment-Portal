import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

function Materials() {
  const [searchParams] = useSearchParams();
  const examId = searchParams.get("exam");

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (!examId) return;

    api
      .get("/materials", { params: { exam: examId } })
      .then(res => setMaterials(res.data))
      .catch(err => console.error(err));
  }, [examId]);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    formData.append("examId", examId);

    try {
      await api.post("/materials", formData);
      const res = await api.get("/materials", { params: { exam: examId } });
      setMaterials(res.data);
      alert("Upload successful");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h3>Study Materials</h3>

        <form onSubmit={handleUpload}>
          <input className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input type="file" className="form-control mb-3"
            onChange={e => setFile(e.target.files[0])}
          />

          <button className="btn btn-warning w-100">
            ⬆ Upload Material
          </button>
        </form>

        <hr />

        {materials.map(m => (
          <div key={m.id}>
            <h6>{m.title}</h6>
            <a
              href={`http://localhost:5000/uploads/${m.link}`}
              target="_blank"
              rel="noreferrer"
            >
              View / Download
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default Materials;
