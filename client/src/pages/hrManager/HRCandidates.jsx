import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Topbar from '../../components/hrNavbar/HRNavbar';
import HrSidebar from '../../components/hrSidebar/HrSidebar';
import Candidates from '../../components/candidates/Candidates';

function HRCandidates() {
    const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (!token ) return navigate("/hr/login");
  }, [navigate]);
  return (
    <div className="page">
      <Topbar />
      <HrSidebar />
      <div className="component">
        <Candidates/>
      </div>
    </div>
  );
}

export default HRCandidates