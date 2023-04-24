import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./EditProfilePic.css";
import { uploadProfilePhoto } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/store";

function EditProfilePhoto({
  profilePic,
  oldProfileImg,
  setOldProfileImg,
  setProfilePic,
}) {
  const [profile, setProfile] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShow(false);
    setProfile("");
  };
  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // checking for the correct image type
    if (!/^image\/(jpe?g|png|gif|webp)$/.test(profile.type)) {
      return toast.error("Please Provide a valid image extension", {
        position: "top-center",
      });
    }
    try {
      setLoading(true);
      uploadProfilePhoto(profile, oldProfileImg).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          setProfile("");
          setProfilePic(URL.createObjectURL(profile));
          setOldProfileImg(data.user.profilePicUrl);
          toast.success("Successfully Updated");
        } else {
          setShow(false);
          setProfile("");
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
      <span className="text-white p-0 m-0" onClick={handleShow}>
        <img className="profile_img" src={profilePic} alt="" />
      </span>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Upload Profile Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="profileimgpreviewdiv  mx-auto">
            <img
              className="imgprofile"
              src={
                profile
                  ? URL.createObjectURL(profile)
                  : "upload_profile_default.avif"
              }
              height={300}
              alt=""
            />
          </div>
          <div className="m-auto d-flex justify-content-center">
            <span className="px-3 my-2 py-1  text-secondary ">
              Upload your photo so that others can identify you
            </span>
          </div>
          <Form.Group controlId="Poster" className="mb-3">
            <Form.Label className=" px-3 m-2 ms-auto me-3 py-1 bg-primary text-white">
              Upload Photo
            </Form.Label>
            <Form.Control
              className="d-none"
              onChange={(e) => setProfile(e.target.files[0])}
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
              {profile && (
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

export default EditProfilePhoto;
