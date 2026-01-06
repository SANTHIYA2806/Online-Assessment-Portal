import { Navigate } from "react-router-dom";

const StudentRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "student" ? children : <Navigate to="/" />;
};

export default StudentRoute;
