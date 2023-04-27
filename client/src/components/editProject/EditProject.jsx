import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {  editProject } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/store";

function EditProject({ id }) {
  const [state, setState] = useState({
    name: "",
    url: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const { user } = useSelector((state) => state.user);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleShow = () => {
    const editSkill = user.projects.filter((item) => item._id === id);
    const editState = editSkill[0];
    setState(editState);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setState({
      name: "",
      url: "",
      startDate: "",
      endDate: "",
      description: "",
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
    if (!state.name || state.name.match(/^\s*$/)) {
      return toast.error("Name field required");
    }
    if (!state.url || state.url.match(/^\s*$/)) {
      return toast.error("url field required");
    }
    if (!state.startDate) {
      return toast.error("Start Date field required");
    }
    if (!state.endDate) {
      return toast.error("End Date required");
    }
    if (!state.description) {
      return toast.error("Description field required");
    }

    try {
      setLoading(true);
      editProject(state._id,state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated");
        } else {
          setShow(false);
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
      <button
        onClick={handleShow}
        className="rounded px-2  border-0 text-primary "
      >
        Edit
      </button>
      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add A Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the Project Name"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Add Project Url</Form.Label>
            <Form.Control
              type="text"
              name="url"
              placeholder="Add project link"
              value={state.url}
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
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              rows={3}
              value={state.description}
              onChange={handleInputChange}
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

export default EditProject;
