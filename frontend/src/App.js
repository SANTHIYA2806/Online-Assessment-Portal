import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import AddQuestions from "./pages/AddQuestions";
import CreateExam from "./pages/CreateExam";
import Materials from "./pages/Materials";
import Results from "./pages/Results";
import Exam from "./pages/Exam";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminResults from "./pages/AdminResults";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import StudentRoute from "./components/StudentRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* DEFAULT */}
        <Route path="/" element={<Login />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/create-exam"
          element={
            <AdminRoute>
              <CreateExam />
            </AdminRoute>
          }
        />

        <Route
          path="/add-questions/:examId"
          element={
            <AdminRoute>
              <AddQuestions />
            </AdminRoute>
          }
        />

        <Route
          path="/results"
          element={
            <AdminRoute>
              <AdminResults />
            </AdminRoute>
          }
        />

        {/* ================= SHARED ================= */}
        <Route
          path="/materials"
          element={
            <ProtectedRoute allowedRoles={["admin", "student"]}>
              <Materials />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT ================= */}
        <Route
          path="/exam/:id"
          element={
            <StudentRoute>
              <Exam />
            </StudentRoute>
          }
        />

        <Route
          path="/results/my"
          element={
            <StudentRoute>
              <Results />
            </StudentRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
