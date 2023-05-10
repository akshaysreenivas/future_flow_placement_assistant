import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { updateBasicInfo } from "../../services/userServices";
import { toast } from "react-toastify";
import LoadingButton from "../loadingButton/LoadingButton";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails } from "../../store/store";
import "./AddBasicInfo.css";
import { FaEdit } from "react-icons/fa";

function AddBasicInfo() {
  const [state, setState] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    website: "",
    State: "",
    district: "",
  });
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setState({
        name: user.name,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        website: user.website,
        State: user.location?.state,
        district: user.location?.district,
      });
    }
  }, [user]);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleClose = () => {
    setState({
      name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      website: user.website,
      State: user.location?.state,
      district: user.location?.district,
    });
    setShow(false);
  };

  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };

  const handleShow = () => setShow(true);

  const handleSubmit = () => {
    // name validation
    if (!state.name || state.name.match(/^\s*$/)) {
      return toast.error("Name field required");
    }
    if (!state.name || state.name.match(/^\s*$/) || state.name.length < 3)
      return toast.error("Valid  name required minimum 3 characters");

    var regex = /[^a-zA-Z0-9]/;

    // check if the name contains special characters
    if (regex.test(state.name)) {
      // name contains special characters
      return toast.error("No special characters");
    }

    // email validation
    if (!state.email || state.email.match(/^\s*$/)) {
      return toast.error("Email field required");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(state.email)) {
      return toast.error("enter a valid email");
    }
    if (
      state.phone &&
      (!/^\d{10}$/.test(state.phone) || !/^\d+$/.test(state.phone))
    ) {
      return toast.error("enter a valid phone number");
    }
    try {
      setLoading(true);
      updateBasicInfo(state).then((data) => {
        if (data.status) {
          dispatch(setUserDetails(data.user));
          setShow(false);
          toast.success("Successfully Updated", {autoClose: 1000});
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
      <FaEdit size={25} className="pointer" onClick={handleShow} />

      <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Basic Informations</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3 position-relative">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Your Name"
              id="name"
              value={state.name}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter Email ID"
              id="name"
              value={state.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="Male"
                name="gender"
                for="gender"
                id="male"
                value="Male"
                checked={state.gender === "Male"}
                onChange={handleInputChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Female"
                name="gender"
                id="female"
                value="Female"
                checked={state.gender === "Female"}
                onChange={handleInputChange}
              />
              <Form.Check
                inline
                type="radio"
                label="Other"
                name="gender"
                value="Other"
                id="other"
                checked={state.gender === "Other"}
                onChange={handleInputChange}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="phone"
              name="phone"
              placeholder="Enter the Phone number"
              value={state.phone}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Website</Form.Label>
            <Form.Control
              type="text"
              name="website"
              placeholder="Enter your wesite Address"
              value={state.website}
              onChange={handleInputChange}
            />
          </Form.Group>
          <div className="row g-2">
            <h6>Enter Your Location</h6>
            <Form.Group className="mb-3 col">
              <Form.Label>District</Form.Label>
              <Form.Control
                type="text"
                name="district"
                placeholder="Enter the District"
                value={state.district}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3 col">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                name="State"
                placeholder="Enter your State"
                value={state.State}
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

export default AddBasicInfo;
