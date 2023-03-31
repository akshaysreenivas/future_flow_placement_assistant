import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/login/Login";

function AdminLogin() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminAuthToken");
    if (token) return navigate("/admin/dashboard");
  }, [navigate]);
  return <Login role={"Admin"} url={"https://img.freepik.com/free-vector/competent-resume-writing-professional-cv-constructor-online-job-application-profile-creation-african-american-woman-filling-up-digital-form-concept-illustration_335657-2053.jpg?size=626&ext=jpg&ga=GA1.1.1478787354.1678959639&semt=ais"} />;
}

export default AdminLogin;
