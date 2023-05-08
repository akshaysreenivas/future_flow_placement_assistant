import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddCertification from "../addCertification/AddCertification";
import { deleteCertification } from "../../services/userServices";
import Swal from "sweetalert2";
import { setUserDetails } from "../../store/store";
import { toast } from "react-toastify";
import EditCertification from "../editCertification/EditCertification";

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const allCertifications = user?.certifications;

  useEffect(() => {
    if (allCertifications) {
      setCertifications(allCertifications);
    }
  }, [allCertifications]);

  return (
    <div>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img className="mx-2 border-1" src="winner.png" width={30} alt="" />
          Certifications
        </h3>
        <AddCertification />
      </div>

      {certifications.length ? (
        certifications.map((item) => {
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
                  deleteCertification(item._id).then((data) => {
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
              className="single-exp-div p-3 border rounded m-1 border-secondary border-1"
            >
              <div className="d-flex align-items-center justify-content-between">
                <h4>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h4>
                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="rounded px-2  border-0 text-dark "
                  >
                    Delete
                  </button>
                  <EditCertification id={item._id} />
                </div>
              </div>
              <p className="text-secondary lead">{item.issuingOrganization}</p>
              <p className="text-muted">
                <small>issued {item.date}</small>
              </p>
            </div>
          );
        })
      ) : (
        <div className="p-5 add_exp_img_div  flex-column">
          <img
            className="add_exp_img"
            width={300}
            src="add_certifications.avif"
            alt=""
          />
          <p className="text-center text-muted">
            Stand out from the crowd by adding your certifications!
          </p>
        </div>
      )}
    </div>
  );
}

export default Certifications;
