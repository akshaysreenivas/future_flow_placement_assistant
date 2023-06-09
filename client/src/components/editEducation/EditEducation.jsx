import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { editEducation } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/store";

function EditEducation({ id }) {
  const [state, setState] = useState({
    institution: "",
    fieldofStudy: "",
    degree: "",
    startDate: "",
    endDate: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleShow = () => {
    const editData = user.education.filter((item) => item._id === id);
    const editState = editData[0];
    setState(editState);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setState({
      institution: "",
      fieldofStudy: "",
      degree: "",
      startDate: "",
      endDate: "",
    });
  };

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };
  const handleSubmit = () => {
    // password validation
    if (!state.institution || state.institution.match(/^\s*$/)) {
      return toast.error("Instutute Name field required");
    }
    if (!state.degree || state.degree.match(/^\s*$/)) {
      return toast.error("degree field required");
    }
    if (!state.fieldofStudy || state.fieldofStudy.match(/^\s*$/)) {
      return toast.error("field of study required");
    }
    if (!state.startDate) {
      return toast.error("Start Date field required");
    }
    if (!state.endDate) {
      return toast.error("End Date required");
    }

    try {
      setLoading(true);
      editEducation(state._id, state).then((data) => {
        setLoading(false);
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated", {autoClose: 1000});
        } else {
          setShow(false);
          toast.error("Something went Wrong", {autoClose: 1000});
        }
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      setShow(false);
      toast.error("Something went Wrong", {autoClose: 1000});
    }
  };
  return (
    <>
      <button
        onClick={handleShow}
        className="rounded px-2  border-0 text-primary"
      >
        Edit
      </button>

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Education</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Institution</Form.Label>
            <Form.Control
              type="text"
              name="institution"
              placeholder="Enter Name of the institute"
              value={state.institution}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Degree</Form.Label>
            <Form.Control
              type="text"
              name="degree"
              placeholder="Enter the Role"
              value={state.degree}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Field of Study</Form.Label>
            <Form.Control
              type="text"
              name="fieldofStudy"
              placeholder="Enter field of Study"
              value={state.fieldofStudy}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="row g-2">
            <Form.Group className="mb-3 col">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={state.startDate}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 col">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="endDate"
                value={state.endDate}
                onChange={handleInputChange}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          {loading ? (
            <LoadingButton
              size="sm"
              className="loading_profile_upload"
              variant={"light"}
            />
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancel
              </Button>

              <Button type="button" variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditEducation;
