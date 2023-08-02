import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddAttachment from "../addAttachments/AddAttachments";
import Swal from "sweetalert2";
import { deleteAttachments } from "../../services/userServices";
import { setUserDetails } from "../../store/store";
import { toast } from "react-toastify";

function Attachments() {
  const [attachments, setattachments] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const allAttachments = user?.attachments;

  useEffect(() => {
    if (allAttachments) {
      setattachments(allAttachments);
    }
  }, [allAttachments]);

  return (
    <div>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <h3>
          <img className="mx-2 border-1" src="link.png" width={30} alt="" />
          Attachments
        </h3>
        <AddAttachment />
      </div>

      {attachments.length ? (
        attachments.map((item) => {
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
                  deleteAttachments(item._id).then((data) => {
                    if (data.status) {
                      dispatch(setUserDetails(data.user));
                      toast.success("Successfully deleted", {autoClose: 1000});
                    } else {
                      toast.error("Something went Wrong", {autoClose: 1000});
                    }
                  });
                } catch (error) {
                  toast.error("Something went Wrong", {autoClose: 1000});
                }
              }
            });
          };
          return (
            <div
              key={item._id}
              className="single-exp-div p-2 border rounded m-1 border-secondary border-1"
            >
              <div className="d-flex align-items-center justify-content-between">
                <img src="/pdf.avif" height={50} width={50} alt="" />
                <h5>
                  {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                </h5>
                <div className="d-flex align-items-center gap-3">
                  <button
                    onClick={handleDelete}
                    className="rounded px-2  border-0 text-dark "
                  >
                    Delete
                  </button>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    <button className="rounded px-2 bg-info  border-0 text-white ">
                      view
                    </button>
                  </a>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-5 add_exp_img_div  flex-column">
          <img
            className="add_exp_img"
            width={300}
            src="add_resume.avif"
            alt=""
          />
          <p className="text-center text-muted">
            Add your resume and other attachements here !
          </p>
        </div>
      )}
    </div>
  );
}

export default Attachments;
