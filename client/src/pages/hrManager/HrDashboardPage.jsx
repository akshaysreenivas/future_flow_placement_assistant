import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/hrNavbar/HRNavbar";
import HrSidebar from "../../components/hrSidebar/HrSidebar";
import HrDashboard from "../../components/hrDashboard/HrDashboard";

function HrDashboardPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (!token || token === "undefined") return navigate("/hr/login");
  }, [navigate]);
  return (
    <div className="page">
      <Topbar />
      <HrSidebar />
      <div className="component">
        <h1>Dashboard</h1>
        <HrDashboard />
      </div>
    </div>
  );
}

export default HrDashboardPage;
