import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import Topbar from "../../components/hrNavbar/HRNavbar";
import HrSidebar from "../../components/hrSidebar/HrSidebar";
import ListJobs from "../../components/listJobs/ListJobs";

function HRListJobs() {
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
        <ListJobs />
      </div>
    </div>
  );
}

export default HRListJobs;
