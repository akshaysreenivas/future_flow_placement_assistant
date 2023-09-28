import React from "react";

import UserNavBar from "../../components/userNavbar/UserNavBar";
import AppliedJobs from "../../components/appliedJobs/AppliedJobs";

function AppliedJobsPage() {
  return (
    <div className='user_page mx-2'>
    <UserNavBar user={true}/>
      <div className="user_page  d-flex  justify-content-center">  
          <AppliedJobs />
      </div>
    </div>
  );
}



export default AppliedJobsPage;