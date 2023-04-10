import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavBar from "../../components/userNavbar/UserNavBar";
import Jobs from "../../components/jobs/Jobs";

function JobsPage() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/");
  }, [navigate, user]);

  return (
    <>
      <UserNavBar />
      <div className="m-3 px-5 d-flex">
        <div className="px-3">lkjhi</div>
        <div className="px-4">
          <h1>
            Find your <span className="text-primary">DREAM</span> Job
          </h1>
          <Jobs />
        </div>
      </div>
    </>
  );
}

export default JobsPage;
