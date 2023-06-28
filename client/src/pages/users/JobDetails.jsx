import { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import JobVIew from "../../components/jobView/JobVIew";
import Loading from "../../components/loading/Loading";
function JobDetails() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");
  }, [navigate, user]);

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
