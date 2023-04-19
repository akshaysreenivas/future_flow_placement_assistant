import React from "react";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { MdOutlineDateRange } from "react-icons/md";
import { VscLocation } from "react-icons/vsc";
import { getJob } from "../../services/userServices";
import "./JobView.css"


function JobVIew() {
  const navigate = useNavigate();
  const [job, setJob] = useState({});
  const [skill, setSkills] = useState([]);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");

    // fetching the datas
    getJob(id)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          console.log(data);
          let { company } = d.hrID;
          d.company = company;
          const { skills } = d;
          setSkills(skills);
          setJob(d);
          return;
        }
        toast.error(data.message, { position: "top-left" });
      })
      .catch((error) => {
        toast.error("Something Went Wrong", { position: "top-center" });
      });
  }, [navigate,id]);
  return (
      
      <div className="job_main_div bg-white px-5 py-4 m-3">
        
        <div className="">
          <h1 className="">{job.job_type}</h1>
          <p>
            <span className="text-secondary">{job.company}</span>
          </p>
          <p className="text-secondary">
            Department : <span className="text-secondary">{job.department}</span>{" "}
          </p>
          <p className="text-secondary">
            Salary : <span>₹ {job.min_salary + " - " + job.max_salary}</span>
          </p>

          <div className="">
          <img
            src={process.env.REACT_APP_BASE_URL + job.poster}
            width={350}
            height={450}
            alt="job poster"
          />
        </div>

          <h4 className="mt-4 mb-3">Job Description</h4>
          <p className="">{job.description}</p>
          <p className="highlight_div">
            <VscLocation size={30} /> Location - {job.location}
          </p>
          <p className="highlight_div">
            <MdOutlineDateRange size={30} /> Posted Date- {job.date}
          </p>

          <div className="requirements_div pb-5">
            <h3 className="my-3">Requirements</h3>

            <h6 className="mb-4">Required Skills</h6>
            <div className="skills_div m-2 p-2 mb-4">
              {skill.map((item) => (
                <span className="p-2 px-5 m-2">{item}</span>
              ))}
            </div>
            <div className="mb-4 experience_div">
              <h6 className="mb-4 ">Experience</h6>
              <p>{job.experience}</p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default JobVIew;
