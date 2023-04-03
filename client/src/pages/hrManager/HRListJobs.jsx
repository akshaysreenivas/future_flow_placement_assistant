import React from "react";
import Topbar from "../../components/hrNavbar/HRNavbar";
import HrSidebar from "../../components/hrSidebar/HrSidebar";
import ListJobs from "../../components/listJobs/ListJobs";

function HRListJobs() {
  return (
    <div className="page">
    <Topbar/>
      <HrSidebar />
      <div className="component">
        <ListJobs />
      </div>
    </div>
  );
}

export default HRListJobs;
