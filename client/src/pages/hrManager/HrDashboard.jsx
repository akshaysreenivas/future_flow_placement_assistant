import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HrSidebar from "../../components/hrSidebar/HrSidebar";

function HrDashboard() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (!token || token ==="undefined") return navigate("/hr/login");
  }, [navigate]);
  return (
    <div className="page">
    <HrSidebar />
    <div className="admin_component">
      <h1>Dashboard</h1>
    </div>
  </div>
  );
}

export default HrDashboard;
