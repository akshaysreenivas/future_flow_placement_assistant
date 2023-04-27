import React from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useEffect } from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import {
  applyJob,
  cancelJobApplication,
  getJob,
} from "../../services/userServices";
import "./JobView.css";
import LoadingButton from "../loadingButton/LoadingButton";

function JobVIew() {
  const navigate = useNavigate();
  const [job, setJob] = useState({});
  const [skill, setSkills] = useState([]);
  const [applyLoading, setapplyLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");

    // fetching the datas
    getJob(id)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          console.log(d)
          let { company ,name,email } = d.hrID;
          d.company = company;
          d.name = name;
          d.email = email;
          const { skills } = d;
          setSkills(skills);
          d.applyloading = false;
          setJob(d);

          return;
        }
        toast.error(data.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong");
      });
  }, [navigate, id]);

  const handleApply = () => {
    try {
      setapplyLoading(true);
      const newJob = job;
      setJob(newJob);
      // applying for the job
      applyJob(job._id).then((data) => {
        setapplyLoading(false);

        if (data.status) {
          newJob.isApplied = true;
          setJob(newJob);

          toast.success(data.message, {
            autoClose: 1000,
          });
        }
      });
    } catch (err) {
      toast.error(err, "Something went wrong", { autoClose: 1000 });
      setapplyLoading(false);
    }
  };
  const handleCancel = () => {
    try {
      setapplyLoading(true);
      const newJob = job;
      setJob(newJob);
      // applying for the job
      cancelJobApplication(job._id).then((data) => {
        setapplyLoading(false);
        if (data.status) {
          newJob.isApplied = false;
          setJob(newJob);
          toast.success(data.message, { autoClose: 1000 });
        }
      });
    } catch (err) {
      toast.error("Something went wrong", { autoClose: 1000 });
      setapplyLoading(false);
    }
  };
  return (
    <div className="bg-white job_full_Details">
      <h1 className="">{job.job_type}</h1>
      <div className="d-flex job-details">
        <div>
          <p className="text-secondary ">
            <span className="text-secondary">{job.company}</span>
          </p>
          <p className="text-secondary m-0">
            Department :
            <span className="text-secondary">{job.department}</span>
          </p>
          <p className="text-secondary">
            Salary : <span>₹ {job.min_salary + " - " + job.max_salary}</span>
          </p>
          <p className="highlight_div mt-4">
            <VscLocation size={30} /> Location - {job.location}
          </p>
          <p className="highlight_div mt-4">
            <MdOutlineDateRange size={30} /> Posted Date - {job.date}
          </p>
          <p className="m-1">
            Uploaded By - {job.name}
          </p>
          <p className="">
          {job.email}
          </p>

          {applyLoading ? (
            <LoadingButton size="sm" className="apply_butn text-white " />
          ) : job.isApplied ? (
            <button onClick={handleCancel} className="apply_butn text-white">
              Cancel Application
            </button>
          ) : (
            <button onClick={handleApply} className="apply_butn text-white ">
              Apply Now
            </button>
          )}
        </div>

        <div className="posterimgdiv">
          <img
            src={process.env.REACT_APP_BASE_URL + job.poster}
            className="card-img"
            alt="job poster"
          />
        </div>
      </div>
      <h4 className="mt-4 mb-3">Job Description</h4>
      <p className="">{job.description}</p>

      <div className="requirements_div pb-5">
        <h3 className="my-3">Requirements</h3>

        <h6 className="mb-4">Required Skills</h6>
        <div className="skill_div m-2 p-2 mb-4">
          {skill.map((item, i) => (
            <span key={i} className="skill p-2 m-2">
              {item}
            </span>
          ))}
        </div>
        <div className="mb-4 experience_div">
          <h6 className="mb-4 ">Experience</h6>
          <p>{job.experience}</p>
        </div>
      </div>
    </div>
  );
}

export default JobVIew;
