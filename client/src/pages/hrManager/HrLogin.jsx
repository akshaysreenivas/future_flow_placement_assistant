import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/login/Login";

function HrLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (token) return navigate("/hr/dashboard");
  }, [navigate]);
  return <Login role={"HR"} url={"https://img.freepik.com/free-vector/recruit-agent-analyzing-candidates_74855-4565.jpg?size=626&ext=jpg&ga=GA1.1.1478787354.1678959639&semt=ais"} />;
}

export default HrLogin;
