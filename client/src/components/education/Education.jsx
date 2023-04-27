import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddEducation from "../addEducation/AddEducation";
import Swal from "sweetalert2";
import { deleteEducation } from "../../services/userServices";
import { setUserDetails } from "../../store/store";
import { toast } from "react-toastify";
import EditEducation from "../editEducation/EditEducation";

function Education() {
  const [education, setEducation] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const allEducation = user?.education;

  useEffect(() => {
    if (allEducation) {
      setEducation(allEducation);
    }
  }, [allEducation]);
  return (
    <div>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img
            className="mx-2 border-1"
            src="education.avif"
            width={25}
            alt=""
          />
          Education
        </h3>
        <AddEducation />
      </div>
      <ul className="p-0">
        {education.length ? (
          education.map((item) => {
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
                    deleteEducation(item._id).then((data) => {
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
                className="d-flex px-1 justify-content-between align-items-start"
              >
                <li>
                  <h3>{item.institution}</h3>
                  <p>
                    {item.startDate} - {item.endDate}
                  </p>
                  <p>{item.degree}</p>
                  <p>{item.fieldofStudy}</p>
                </li>
                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="rounded px-2  border-0 text-dark "
                  >
                    Delete
                  </button>
                  <EditEducation id={item._id} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-5 add_exp_img_div  flex-column">
            <img
              className="add_exp_img"
              width={300}
              src="add_education.avif"
              alt=""
            />
            <p className="text-center text-muted">
              Highlight your qualifications by adding your education!
            </p>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Education;
