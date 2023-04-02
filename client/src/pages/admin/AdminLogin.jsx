import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/login/Login";

function AdminLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    if (token) return navigate("/admin/dashboard");
  }, [navigate]);
  return <Login role={"Admin"} url={"/adminlogin.webp"} />;
}

export default AdminLogin;
