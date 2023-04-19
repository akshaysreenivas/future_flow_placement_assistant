import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import EditJob from '../../components/editJobPost/EditJobPost';
import Topbar from '../../components/hrNavbar/HRNavbar';
import HrSidebar from '../../components/hrSidebar/HrSidebar';

function HREditJobPost() {
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
    <EditJob/>
    </div>
  </div>
  
  )
}

export default HREditJobPost