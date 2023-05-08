import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { addJob } from "../../services/hrServices";
import LoadingButton from "../loadingButton/LoadingButton";
import "./AddJob.css";
function AddJob() {
  const [loading, setLoading] = useState();
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [poster, setPoster] = useState();
  const [state, setState] = useState({
    department: "",
    job_type: "",
    job_role: "",
    location: "",
    experience: "",
    min_salary: "",
    max_salary: "",
    description: "",
  });

  const handleAddSkill = () => {
    setRequiredSkills([...requiredSkills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = [...requiredSkills];
    updatedSkills.splice(index, 1);
    setRequiredSkills(updatedSkills);
  };

  const handleSkillChange = (index, e) => {
    const updatedSkills = [...requiredSkills];
    updatedSkills[index] = e.target.value;
    setRequiredSkills(updatedSkills);
  };
  const handleSkillBlur = (index, e) => {
    if (e.target.value === "" || e.target.value.match(/^\s*$/)) {
      const updatedSkills = [...requiredSkills];
      updatedSkills.splice(index, 1);
      setRequiredSkills(updatedSkills);
    }
  };
  const handleInputChange = (event) => {
    setState((prevProps) => ({
      ...prevProps,
      [event.target.name]: event.target.value,
    }));
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    state.skills = requiredSkills;
    state.image = poster;
    // validations
    // image validation
    if (!state.image) return toast.error("Poster image required");

    // checking for the correct image type
    if (!/^image\/(jpe?g|png|gif|webp)$/.test(state.image.type)) {
      return toast.error("Please Provide a valid image extension");
    }

    if (!state.department || state.department.match(/^\s*$/))
      return toast.error("Department field required");

    if (!state.job_type || state.job_type.match(/^\s*$/))
      return toast.error("Job Type field required");

    if (!state.job_role || state.job_role.match(/^\s*$/))
      return toast.error("Job Type field required");

    if (!state.location || state.location.match(/^\s*$/))
      return toast.error("Location field required");

    if (!state.min_salary || state.min_salary.match(/^\s*$/))
      return toast.error("Please Provide a Minimum Salary");

    if (!state.max_salary || state.max_salary.match(/^\s*$/))
      return toast.error("Please Provide a Maximum Salary");

    if (parseInt(state.max_salary) < 0 || parseInt(state.min_salary) < 0)
      return toast.error("oops! Salary Cannot be negative number");

    if (parseInt(state.max_salary) < parseInt(state.min_salary)) {
      return toast.error("oops! Maximum Salary is less than minimum salary");
    }

    if (!state.description || state.description.match(/^\s*$/))
      return toast.error("Please Provide a job Description");

    setLoading(true);
    // calling api
    addJob(state)
      .then((data) => {
        setLoading(false);

        if (data.status) {
          const newState = {
            department: "",
            job_type: "",
            job_role: "",
            location: "",
            experience: "",
            min_salary: "",
            max_salary: "",
            description: "",
          };
          setRequiredSkills([""]);
          setState(newState);
          setPoster(null);
          return Swal.fire(
            "Success",
            "Successfully Added Job Vacancy",
            "success"
          );
        }
        toast.error(data.message, { position: "top-center" });
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Something went Wrong", { position: "top-center" });
      });
  };
  return (
    <>
      <div className="form_div mx-lg-5">
        <h2 className="pb-3 mt-0">Post a job vacancy</h2>
        <Form onSubmit={handlesubmit}>
          <Row>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Department</Form.Label>
              <Form.Select
                defaultValue={"Full-time"}
                aria-label="Default select"
                name="department"
                id="department"
                value={state.department}
                onChange={handleInputChange}
              >
                <option defaultChecked value="">
                  Select Department
                </option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Human-Resources">Human Resources (HR)</option>
                <option value="Information-Technology">
                  Information Technology (IT)
                </option>
                <option value="Project-Management">Project Management</option>
                <option value="Finance">Finance</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Job Type</Form.Label>
              <Form.Select
                name="job_type"
                defaultValue={"Full-time"}
                aria-label="Default select"
                id="job_type"
                value={state.job_type}
                onChange={handleInputChange}
              >
                <option defaultChecked value="">
                  Select Job Type
                </option>
                <option value="Full-time">Full time</option>
                <option value="Part-time">Part time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Job Role </Form.Label>
              <Form.Control
                type="text"
                name="job_role"
                id="job_role"
                value={state.job_role}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Location </Form.Label>
              <Form.Control
                type="text"
                name="location"
                id="location"
                value={state.location}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Experience</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="experience"
              id="experience"
              value={state.experience}
              onChange={handleInputChange}
            />
            <Form.Text>Leave Blank If no Experience is needed</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" as={Row} controlId="requiredSkills">
            <Form.Label>Required Skills</Form.Label>
            <Col sm={5}>
              {requiredSkills &&
                requiredSkills.map((skill, index) => (
                  <Row key={index} className="mb-2">
                    <Col sm={9}>
                      <Form.Control
                        type="text"
                        name="skills"
                        value={skill}
                        onChange={(e) => handleSkillChange(index, e)}
                        onBlur={(e) => handleSkillBlur(index, e)}
                      />
                    </Col>
                    <Col sm={3}>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveSkill(index)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
              <Button variant="success" onClick={handleAddSkill}>
                Add Skill
              </Button>
            </Col>
          </Form.Group>

          <Row>
            <h5>Salary Range</h5>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Min Salary</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="min_salary"
                id="min_salary"
                value={state.min_salary}
                onChange={handleInputChange}
                noValidate
              />
            </Form.Group>
            <Form.Group as={Col} className="mb-3">
              <Form.Label>Max Salary</Form.Label>
              <Form.Control
                type="number"
                min={0}
                name="max_salary"
                id="max_salary"
                value={state.max_salary}
                onChange={handleInputChange}
                noValidate
              />
            </Form.Group>
          </Row>
          <h5>Upload Poster</h5>
          {/*image upload */}

          <Form.Group controlId="Poster" className="mt-2 mb-3">
            <Form.Label>
              <div className="imgpreviewdiv pointer">
                <div className="d-flex flex-column justify-content-center">
                  <img
                    src={
                      poster ? URL.createObjectURL(poster) : "/upload_Icon.png"
                    }
                    width={poster ? 300 : 50}
                    alt=""
                    className="m-auto"
                  />

                  <small>{!poster && "Click to Upload"}</small>
                </div>
              </div>
            </Form.Label>
            <Form.Control
              className="d-none"
              onChange={(e) => setPoster(e.target.files[0])}
              name="poster"
              type="file"
              size="sm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Job Description"
              style={{ height: "200px" }}
              name="description"
              id="description"
              value={state.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          {loading ? (
            <LoadingButton
              size={"sm"}
              variant={"white"}
              className={"submitButton rounded"}
            />
          ) : (
            <Button type="submit" className="submitButton">
              Submit
            </Button>
          )}
        </Form>
      </div>
    </>
  );
}

export default AddJob;
