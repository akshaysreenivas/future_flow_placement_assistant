import React, { useState } from "react";
import "./JobDetails.css";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { getJobDetails } from "../../services/hrServices";
import { toast } from "react-toastify";
import { MdOutlineDateRange } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import { VscLocation } from "react-icons/vsc";
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Loading from "../loading/Loading";

function JobDetails() {
  const navigate = useNavigate();
  const [jobs, setJob] = useState({});
  const [skill, setSkills] = useState([]);
  const [LoadingData, setLoadingData] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("hrAuthToken");
    if (!token || token === "undefined") return navigate("/hr/login");

    // fetching the datas
    getJobDetails(id)
      .then((data) => {
        if (data.status) {
          const d = data.result;
          let { company } = d.hrID;
          d.company = company;
          const { skills } = d;
          setSkills(skills);
          setJob(d);
          setLoadingData(false)
          return;
        }
        toast.error(data.message, { position: "top-left" });
      })
      .catch((error) => {
        setLoadingData(false)
        toast.error("Something Went Wrong", { position: "top-center" });
      });
  }, [navigate,  id]);
  return (
    <>
    <Link className="link" to={`/hr/jobs/editJobDetails/${jobs._id}`}><Button className="edit_btn my-4 py-2 px-5"><TbEdit/> Edit</Button> </Link>

      <div className="bg-white job_full_Details">
    {!LoadingData ? 
      jobs && <>
      <h1 className="">{jobs.job_role}</h1>
      <div className="d-flex job-details">
      <div>
      <p className="text-secondary m-0">
      <span className="text-secondary">{jobs.company}</span>
      </p>
      <h6 className="">{jobs.job_type}</h6>
          <p className="text-secondary m-0">
            Department :
            <span className="text-secondary">{jobs.department}</span>
          </p>
          <p className="text-secondary">
            Salary : <span>₹ {jobs.min_salary + " - " + jobs.max_salary}</span>
          </p>
          <p className="highlight_div mt-4">
            <VscLocation size={30} /> Location - {jobs.location}
          </p>
          <p className="highlight_div mt-4">
            <MdOutlineDateRange size={30} /> Posted Date - {jobs.date}
          </p>
          <h6 className="mb-4">Required Skills</h6>
        <div className="skill_div m-2 p-2 mb-4">
          {skill.map((item, i) => (
            <span key={i} className="skill p-2 m-2">
              {item}
            </span>
          ))}
        </div><div className="mb-4 experience_div">
          <h6 className="mb-4 ">Experience</h6>
          <p>{jobs.experience}</p>
        </div>

        </div>

        <div className="posterimgdiv">
          <img
            src={process.env.REACT_APP_BASE_URL + jobs.poster}
            className="card-img"
            alt="job poster"
          />
        </div>
      </div>
      <h4 className="mt-4 mb-3">Job Description</h4>
      <p className="">{jobs.description}</p>
      <div className="requirements_div pb-5">
        
      </div>
      </>
      :<div className="d-flex align-items-center justify-content-center p-5">
      <Loading/>
      </div>}
      </div>

    </>
  );
}

export default JobDetails;
// <div className="jobDetailsDiv">
//         <div className="Poster_div">
//           <img
//             src={process.env.REACT_APP_BASE_URL + jobs.poster}
//             width={400}
//             alt="job poster"
//           />
//         </div>
//         <div className="details_div">
//           <h1 className="">{jobs.job_role}</h1>
//           <h6 className="">{jobs.job_type}</h6>
//           <p>
//             <span>{jobs.company}</span>
//           </p>
//           <p>
//             Department : <span className="text-blue">{jobs.department}</span>{" "}
//           </p>
//           <p>
//             Salary : <span>₹ {jobs.min_salary + " - " + jobs.max_salary}</span>
//           </p>

//           <h4 className="mt-4 mb-3">Job Description</h4>
//           <p className="">{jobs.description}</p>
//           <p className="highlight_div">
//             <VscLocation size={30} /> Location - {jobs.location}
//           </p>
//           <p className="highlight_div">
//             <MdOutlineDateRange size={30} /> Posted Date- {jobs.date}
//           </p>
          
//           <div className="requirements_div pb-5">
//           <h3 className="my-3">Requirements</h3>

//           <h6 className="mb-4">Required Skills</h6>
//           <div className="skills_div m-2 p-2 mb-4">
//               {skill.map((item) => (
//                 <span className="p-2 px-5 m-2">{item}</span>
//               ))}
//             </div>
//             <div className="mb-4 experience_div">
//             <h6 className="mb-4 ">Experience</h6>
//             <p>{jobs.experience}</p>
//             </div>
//             </div>
       
//           </div>
//       </div>