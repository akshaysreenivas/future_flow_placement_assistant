import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { uploadCoverPhoto } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";
import { FaCameraRetro } from "react-icons/fa";

function EditCoverPhoto({
  coverPic,
  oldCoverImg,
  setOldCoverImg,
  setCoverPic,
}) {
  const [cover, setCover] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setCover("");
  };
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // checking for the correct image type
    if (!/^image\/(jpe?g|png|gif|webp)$/.test(cover.type)) {
      return toast.error("Please Provide a valid image extension");
    }
    try {
      setLoading(true);
      uploadCoverPhoto(cover, oldCoverImg).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          setCover("");
          setCoverPic(URL.createObjectURL(cover));
          setOldCoverImg(data.user.profilePicUrl);
          toast.success("Successfully Updated");
        } else {
          setShow(false);
          setCover("");
          toast.error("Something went Wrong");
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setShow(false);
      toast.error("Something went Wrong");
    }
  };
  return (
    <>
      <span className="text-black p-0 m-0" onClick={handleShow}>
        <FaCameraRetro />
      </span>
      <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Cover Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="profileimgpreviewdiv  mx-auto">
            <img
              className="imgprofile"
              src={
                cover ? URL.createObjectURL(cover) : "cover_upload_default.jpg"
              }
              alt=""
            />
          </div>
          <div className="m-auto d-flex justify-content-center">
            <span className="px-3 my-2 py-1  text-secondary ">
              A good cover photo may increase your chance of getting a job
            </span>
          </div>
          <Form.Group controlId="Poster" className="mb-3">
            <Form.Label className=" px-3 m-2 ms-auto me-3 py-1 bg-primary text-white">
              Upload Photo
            </Form.Label>
            <Form.Control
              className="d-none"
              onChange={(e) => setCover(e.target.files[0])}
              name="poster"
              type="file"
              size="sm"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <LoadingButton
              size="sm"
              className="loading_profile_upload"
              variant={"primary"}
            />
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              {cover && (
                <Button type="button" variant="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>
              )}
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditCoverPhoto;
