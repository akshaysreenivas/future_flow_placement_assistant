import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {IoIosShareAlt } from "react-icons/io"
import "./Projects.css";
import AddProject from "../addProject/AddProject";
import Swal from "sweetalert2";
import { deleteProject } from "../../services/userServices";
import { setUserDetails } from "../../store/store";
import { toast } from "react-toastify";
import EditProject from "../editProject/EditProject";

function Projects() {
  const [projects, setProjects] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const allProjects = user?.projects;

  useEffect(() => {
    if (allProjects) {
      setProjects(allProjects);
    }
  }, [allProjects]);
  return (
    <div>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img
            className="mx-2 border-1"
            src="content-management.png"
            width={35}
            alt=""
          />
          Projects
        </h3>
      <AddProject/>
      </div>

      {projects.length ? (
        projects.map((item) => {
            const handleDelete = () => {
            Swal.fire({
              title: "Are you sure?",
              icon: "warning",
              width: 450,
              heightAuto: false,
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes!",
            }).then((result) => {
              if (result.isConfirmed) {
                try {
                  deleteProject(item._id).then((data) => {
                    if (data.status) {
                      dispatch(setUserDetails(data.user));
                      toast.success("Successfully deleted");
                    } else {
                      toast.error(data.message);
                    }
                  });
                } catch (error) {
                  toast.error("Something went Wrong");
                }
              }
            });
          };
          return (
            <div  key={item._id}  className="single-exp-div p-3 border-bottom border-secondary border-1">
              <div className="d-flex align-items-center justify-content-between">
                <h4>{item.name}</h4>
                <div className="d-flex align-items-center gap-3">
                  <button onClick={handleDelete} className="rounded px-2  border-0 text-dark ">
                    Delete
                  </button>
                  <EditProject id={item._id}/>
                 
                </div>
              </div>
              <span className="text-muted">
                <small> {item.company}</small>
              </span>
              <p className="text-muted">
                <small>
                  {item.startDate} to {item.endDate}
                </small>
              </p>
              <button className="d-flex bg-primary px-3 py-1 m-1  text-white rounded border-0">
                <a
                  href={`https://${item.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white"
                >
                  Show Project <IoIosShareAlt />
                </a>
              </button>

              <p className="text-secondary lead">{item.description}</p>
            </div>
          );
        })
      ) : (
        <div className="p-5 add_project_img_div  flex-column">
          <img
            className="add_project_img"
            width={400}
            src="add_project.avif"
            alt=""
          />
          <p className="text-center text-muted">
            Boost your chances of getting hired by adding projects!
          </p>
        </div>
      )}
    </div>
  );
}

export default Projects;
