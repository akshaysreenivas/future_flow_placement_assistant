import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/login/Login";

function HrLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (token) return navigate("/hr/dashboard");
  }, [navigate]);
  return <Login role={"HR"} url={"/hrlogin.webp"} />;
}

export default HrLogin;
