import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appliedJobs, cancelJobApplication } from "../../services/userServices";
import { toast } from "react-toastify";
import { MdOutlineLocationOn } from "react-icons/md";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import { Button, Form } from "react-bootstrap";
import SearchBar from "../searchBar/SearchBar";

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [limit, setLimit] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [search, setSearch] = useState([]);
  const [filter, setFilter] = useState([]);
  const [department, setDepertment] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect for calling api
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");
    // fetching the datas
    appliedJobs(page, search, filter)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          setPage(data.page);
          setNext(data.next);
          setPrev(data.previous);
          setTotal(data.total);
          setLimit(data.limit);
          setDepertment(data.department);
          const d = data.result;
          console.log(d);
          setJobs(
            d.map((jobs) => ({
              ...jobs,
              isApplied: false,
            }))
          );
          return;
        }
        toast.error(data.message);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error, "Something Went Wrong");
      });
  }, [page, navigate, search, filter]);

  // handling reseting the filterations
  const handleReset = () => {
    setFilter("");
    setSearch("");
    setPage(1);
  };
  return (
    <div className="jobs_parent_div my-3 p-3">
      <div className="mb-4">
        <h1>
          Applied <span className="text-primary">Jobs</span>
        </h1>
        <h6 className="text-secondary">Your applied jobs, all in one place.</h6>
      </div>
      <SearchBar
        placeholder={"Search by Skill , Job type ,Department ,Role"}
        value={search}
        setSearch={setSearch}
      />
      <div className="d-flex justify-content-between align-items-center mb-4 px-4">
        <Form.Select
          size="sm"
          className=""
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="" defaultChecked disabled>
            &#xE16E; Filter By Department
          </option>

          {department?.map((item, index) => (
            <option value={item} key={index}>
              {item}
            </option>
          ))}
        </Form.Select>
        <Button onClick={handleReset}>reset</Button>
      </div>
      <div className="JobsDiv m-3 ">
        {loading ? (
          <div className="d-flex justify-content-center mx-auto my-5">
            <Loading />
          </div>
        ) : jobs.length ? (
          jobs.map((item) => {
            const handleCancel = () => {
              Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                width: 450,
                heightAuto: false,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText:"Abort",
                confirmButtonText: "Confirm!",
              }).then((result) => {
                if (result.isConfirmed) {
                  try {
                    // applying for the job
                    cancelJobApplication(item._id).then((data) => {
                      if (data.status) {
                        const newJobs = [...jobs];
                        const updated = newJobs.filter(
                          (u) => u._id !== item._id
                        );
                        setJobs(updated);
                        toast.success("Job Application Cancelled", {
                          autoClose: 1000,
                        });
                      }
                    });
                  } catch (err) {
                    toast.error("Something went wrong", { autoClose: 1000 });
                  }
                }
              });
            };
            return (
              <div key={item._id} className="job_div gap-2 p-3  my-3">
                <div>
                  <img
                    src={process.env.REACT_APP_BASE_URL + item.poster}
                    width={60}
                    alt=""
                  />
                </div>
                <div>
                  <span className="text-secondary">{item.department}</span>
                  <h4 className="text-primary">{item.job_role}</h4>
                  <h6 className="text-dark">{item.job_type}</h6>
                  <span className="text-secondary">
                    <MdOutlineLocationOn /> {item.location}
                  </span>
                  <span className="text-secondary ms-4">
                    &#x20b9; {item.min_salary + " - " + item.max_salary}
                  </span>
                  <p>
                    {item.description.split(" ").slice(0, 10).join(" ")}
                    {". . ."}
                  </p>
                  <div className="action_btn_div">
                    <button
                      onClick={handleCancel}
                      className="apply_btn text-white py-1 px-4"
                    >
                      Cancel
                    </button>

                    <Link to={`/jobdetails/${item._id}`}>
                      <button className="view_btn py-1 bg-white px-3">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="nojobs_div">
            <img
              width={200}
              className="mx-auto d-block"
              src="/no-matching-job.avif"
              alt=""
            />
            <h6 className="text-center">Jobs that you applied will appear here</h6>
          </div>
        )}
        <Pagination
          page={page}
          total={total}
          limit={limit}
          setPage={setPage}
          next={next}
          prev={prev}
        />
      </div>
    </div>
  );
}

export default AppliedJobs;
