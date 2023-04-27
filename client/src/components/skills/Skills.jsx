import React, { useEffect, useState } from "react";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import "./Skills.css";
import AddSkill from "../addSkills/AddSkill";
import Swal from "sweetalert2";
import { deleteSkill } from "../../services/userServices";
import { setUserDetails } from "../../store/store";
import { toast } from "react-toastify";
import EditSkill from "../editSkill/EditSkill";

function Skills() {
  const [skills, setSkills] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const allSkills = user?.skills;

  useEffect(() => {
    if (allSkills) {
      setSkills(allSkills);
    }
  }, [allSkills]);
  return (
    <div className="container">
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img
            className=" mx-1 border-1"
            src="creativity.png"
            width={30}
            alt=""
          />
          Skills
        </h3>
        <AddSkill />
      </div>
      {skills.length ? (
        <div className="row   row-cols-md-1 row-cols-lg-2">
          {skills.map((item) => {
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
                    deleteSkill(item._id).then((data) => {
                      if (data.status) {
                        dispatch(setUserDetails(data.user));
                        toast.success("Successfully deleted");
                      } else {
                        toast.error("Something went Wrong");
                      }
                    });
                  } catch (error) {
                    toast.error("Something went Wrong");
                  }
                }
              });
            };
            return (
              <div
                key={item._id}
                className="single_skill_div  px-3 py-2  rounded col"
              >
                <div>
                  <h4>{item.name}</h4>
                  <small>{item.level}</small>
                </div>
                <div>
                  <RiDeleteBin4Fill
                    className="bg-secondary pointer text-white p-1 m-1 rounded"
                    onClick={handleDelete}
                    size={20}
                  />
                  <EditSkill id={item._id} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className=" add_skills_img_div p-5  flex-column">
          <img
            className="add_skills_img"
            width={300}
            src="add_skills.avif"
            alt=""
          />
          <p className="text-center text-muted">
            Enhance your employability by adding your skills!
          </p>
        </div>
      )}
    </div>
  );
}

export default Skills;
