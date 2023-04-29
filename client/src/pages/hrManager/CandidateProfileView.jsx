import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserProfileView from "../../components/userProfileView/UserProfileView";
import Topbar from "../../components/hrNavbar/HRNavbar";
import HrSidebar from "../../components/hrSidebar/HrSidebar";

function CandidateProfileView() {
  const navigate = useNavigate();
  
  useEffect(() => {
      // checking for token if not redirecting to login page
      const token = localStorage.getItem("hrAuthToken");
      if (!token || token ==="undefined") return navigate("/hr");

    }, [navigate]);

  return (
    <div className="page">
      <Topbar />
      <HrSidebar />
      <div className="component">
      <UserProfileView />
      </div>
    </div>
  );
}

export default CandidateProfileView;