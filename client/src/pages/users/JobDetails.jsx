import UserNavBar from "../../components/userNavbar/UserNavBar";
import JobVIew from "../../components/jobView/JobVIew";
function JobDetails() {

  return (
    <div className="user_page">
    <UserNavBar user={true}/>
      <div className="  d-flex  justify-content-center">
      <JobVIew />
      </div>
    </div>
  );
}

export default JobDetails;
