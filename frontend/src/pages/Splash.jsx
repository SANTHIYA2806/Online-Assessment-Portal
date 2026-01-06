import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const token = localStorage.getItem("token");
      navigate(token ? "/dashboard" : "/login");
    }, 5000);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <img src={logo} alt="logo" style={styles.logo} />
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
  },
  logo: {
    width: "200px",
  },
};

export default Splash;
