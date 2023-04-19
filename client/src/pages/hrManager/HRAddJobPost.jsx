import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import AddJob from '../../components/addJob/AddJob'
import Topbar from '../../components/hrNavbar/HRNavbar';
import HrSidebar from '../../components/hrSidebar/HrSidebar';

function HRAddJobPost() {
    const navigate = useNavigate();
    useEffect(() => {
      // checking for token if not redirecting to login page
      const token = localStorage.getItem("hrAuthToken");
      if (!token || token ==="undefined") return navigate("/hr");
    }, [navigate]);
  return (
    <div className="page">
    <Topbar/>
    <HrSidebar />
    <div className="component">
    <AddJob/>
    </div>
  </div>
  
  )
}

export default HRAddJobPost