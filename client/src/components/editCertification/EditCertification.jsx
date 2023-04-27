import React, {  useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {editCertification } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/store";

function EditCertification({id}) {
  const [state, setState] = useState({
    name: "",
    issuingOrganization: "",
    date: "",
  });

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleShow = () => {
    const editData = user.certifications.filter((item) => item._id === id);
    const editState = editData[0];
    setState(editState);
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setState({
      name: "",
      issuingOrganization: "",
      date: "",
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
      return toast.error(" Name field required");
    }
    if (
      !state.issuingOrganization ||
      state.issuingOrganization.match(/^\s*$/)
    ) {
      return toast.error("Organizations Name  required");
    }
    if (!state.date) {
      return toast.error("Issued Date required");
    }

    try {
      setLoading(true);
      editCertification(state._id,state).then((data) => {
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
          <Modal.Title>Add Certifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter the Name of the certification"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Issuing Organization</Form.Label>
            <Form.Control
              type="text"
              name="issuingOrganization"
              placeholder="Enter the Name of issuing organization"
              value={state.issuingOrganization}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3 col">
            <Form.Label>Issued Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={state.date}
              onChange={handleInputChange}
            />
          </Form.Group>
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

export default EditCertification;
