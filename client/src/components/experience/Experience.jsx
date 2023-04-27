import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Experience.css";
import AddExperience from "../addExperience/AddExperience";
import Swal from "sweetalert2";
import { deleteExperience } from "../../services/userServices";
import { toast } from "react-toastify";
import { setUserDetails } from "../../store/store";
import EditExperience from "../editExperience/EditExperience";

function Experience() {
  const [experience, setExperience] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const experiences = user?.experiences;

  useEffect(() => {
    if (experiences) {
      setExperience(experiences);
    }
  }, [experiences]);

  return (
    <div>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img
            className="mx-2 border-1"
            src="briefcase.png"
            width={25}
            alt=""
          />
          Experiences
        </h3>
        <AddExperience />
      </div>

      {experience.length ? (
        experience.map((item) => {
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
                  deleteExperience(item._id).then((data) => {
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
              className="single-exp-div p-3 border-bottom border-secondary border-1"
            >
              <div className="d-flex align-items-center justify-content-between">
                <h4>
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </h4>
                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="rounded px-2  border-0 text-dark "
                  >
                    Delete
                  </button>
                  <EditExperience id={item._id} />
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
              <p className="text-secondary lead">{item.description}</p>
            </div>
          );
        })
      ) : (
        <div className="p-5 add_exp_img_div  flex-column">
          <img
            className="add_exp_img"
            width={300}
            src="add_experience.avif"
            alt=""
          />
          <p className="text-center text-muted">
            Showcase your work history and skills by adding your experience!
          </p>
        </div>
      )}
    </div>
  );
}

export default Experience;
