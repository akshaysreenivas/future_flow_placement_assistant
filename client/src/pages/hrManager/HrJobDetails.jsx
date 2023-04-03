import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import Topbar from '../../components/hrNavbar/HRNavbar';
import HrSidebar from '../../components/hrSidebar/HrSidebar';
import JobDetails from '../../components/jobDetails/JobDetails';

function HrJobDetails() {
    const navigate = useNavigate();
    useEffect(() => {
      const token = localStorage.getItem("hrAuthToken");
      if (!token || token ==="undefined") return navigate("/hr/login");
    }, [navigate]);
    return (
      <div className="page">
      <Topbar/>
      <HrSidebar />
      <div className="component">
        <JobDetails/>
      </div>
    </div>
    );
}

export default HrJobDetails