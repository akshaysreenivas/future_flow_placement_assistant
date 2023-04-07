import React, { useState } from "react";
import "./JobDetails.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getJobDetails } from "../../services/hrServices";
import { toast } from "react-toastify";

function JobDetails({ job }) {
  const navigate = useNavigate();
  const [jobs, setJob] = useState({});
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (!token || token === "undefined") return navigate("/hr/login");

    // fetching the datas
    getJobDetails(id)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          console.log(data);
          setJob(d);
          return;
        }
        toast.error(data.message, { position: "top-left" });
      })
      .catch((error) => {
        toast.error(error.message, { position: "top-center" });
      });
  }, [navigate, job, id]);
  return (
    <>
    <div><img src={process.env.REACT_APP_BASE_URL + jobs.poster} width={400} alt="job poster" /></div>
      <div>{jobs.department}</div>
      <div>{jobs.job_type}</div>
      <div>{jobs.skills}</div>
      <div>{jobs.experience}</div>
      <div>{jobs.min_salary}</div>
      <div>{jobs.max_salary}</div>
      <div>{jobs.description}</div>
      <div>{jobs.date}</div>
    </>
  );
}

export default JobDetails;
