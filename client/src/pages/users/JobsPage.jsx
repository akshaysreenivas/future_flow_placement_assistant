import React from "react";

import UserNavBar from "../../components/userNavbar/UserNavBar";
import Jobs from "../../components/jobs/Jobs";

function JobsPage() {

  return (
    <div className='user_page'>
    <UserNavBar user={true}/>
      <div className="user_page  d-flex  justify-content-center">  
          <Jobs />
      </div>
    </div>
  );
}

export default JobsPage;
