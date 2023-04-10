import React, { useEffect, useState } from "react";
import LoadingButton from "../loadingButton/LoadingButton";
import { Button, Form, Table } from "react-bootstrap";
import { changeJobStatus, getJobPosts } from "../../services/hrServices";
import { toast } from "react-toastify";
import { FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import Pagination from "../pagination/Pagination";
import "./ListJobs.css";
import Loading from "../loading/Loading";

function ListJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ sort: "", order: -1 });
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepertment] = useState([]);
  const [limit, setLimit] = useState(3);
  const [total, setTotal] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useeffect for calling api
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("hrAuthToken");
    if (!token || token === "undefined") return navigate("/hr/login");

    // fetching the datas
    getJobPosts(page, sort, search, limit, filter, status)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          setPage(data.page);
          setLimit(data.limit);
          setNext(data.next);
          setPrev(data.previous);
          setTotal(data.total);
          setDepertment(data.department);
          const d = data.result;
          setJobs(d.map((job) => ({ ...job, loading: false })));
          return;
        }
        toast.error(data.message, { position: "top-left" });
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Something Went Wrong", { position: "top-center" });
      });
  }, [page, search, sort, navigate, filter, limit, status]);

  const handleSortChange = (e) => {
    setSort((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleArrowChange = () => {
    setSort((prev) => ({ ...prev, order: prev.order === -1 ? 1 : -1 }));
  };
  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  // handling reseting the filterations
  const handleReset = () => {
    setSort({ sort: "", order: -1 });
    setFilter("");
    setSearch("");
    setStatus("");
    setLimit(3);
  };

  return (
    <div className="table_div">
      <h2 className="mb-3"> Job Posts</h2>
      <div>
        <div className="first_div ">
          <Form.Select
            size="sm"
            value={limit}
            name="limit"
            onChange={(e) => handleLimitChange(e)}
            className="limit"
          >
            <option value="3" defaultChecked>
              showing first 3 datas
            </option>
            <option value="5">Show 5</option>
            <option value="10">Show 10</option>
          </Form.Select>
          <SearchBar value={search} setSearch={setSearch} />
        </div>
        <div className="filter_div my-3">
          <Form.Select
            size="sm"
            value={sort.sort}
            name="sort"
            onChange={(e) => handleSortChange(e)}
            className=""
          >
            <option value={""} defaultChecked disabled>
              Sort By
            </option>
            <option value="department">Department</option>
            <option value="job_type">Job Type</option>
            <option value="min_salary">Salary</option>
            <option value="date">Posted Date</option>
          </Form.Select>
          <button
            name="sort"
            value={sort.order}
            className="arrow_btn"
            onClick={handleArrowChange}
          >
            {sort.order === -1 ? <FaSortAmountDown /> : <FaSortAmountUp />}
          </button>
          <Form.Select
            size="sm"
            value={status}
            name="sort"
            onChange={(e) => handleStatusChange(e)}
            className=""
          >
            <option value="" defaultChecked disabled>
              Filter by Status
            </option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </Form.Select>

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
              Filter By Department
            </option>

            {department.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Form.Select>
          <Button onClick={handleReset}>reset</Button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center mx-auto my-5">
          <Loading />
        </div>
      ) : jobs.length ? (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Poster</th>
              <th>Department</th>
              <th>Job Type</th>
              <th>Salary Range (₹) </th>
              <th>Required skills </th>
              <th>Status</th>
              <th>More info</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs?.map((item) => {
              const changeStatus = () => {
                Swal.fire({
                  title: "Are you sure?",
                  icon: "warning",
                  width: 350,
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    const newJobs = [...jobs];
                    // finding the current row
                    const jobsIndex = newJobs.findIndex(
                      (u) => u._id === item._id
                    );
                    // setting the loading animation
                    newJobs[jobsIndex].loading = true;
                    setJobs(newJobs);
                    // Calling Api
                    changeJobStatus(!item.active, item._id)
                      .then((data) => {
                        const updatedJobs = [...jobs];
                        updatedJobs[jobsIndex].loading = false;
                        if (data.status) {
                          updatedJobs[jobsIndex].active = !item.active;
                          toast(data.message, { position: "top-center" });
                        }
                        setJobs(updatedJobs);
                      })
                      .catch((err) => {
                        const updatedUsers = [...jobs];
                        updatedUsers[jobsIndex].loading = false;
                        setJobs(updatedUsers);
                        toast.error("Something Went Wrong", {
                          position: "top-center",
                        });
                      });
                  }
                });
              };

              return (
                <tr key={item._id}>
                  <td>
                    <img
                      src={process.env.REACT_APP_BASE_URL + item.poster}
                      width={50}
                      alt=""
                    />
                  </td>
                  <td>{item.department}</td>
                  <td>{item.job_type}</td>
                  <td>
                    {item.min_salary === item.max_salary
                      ? item.max_salary
                      : item.min_salary + " - " + item.max_salary}
                  </td>
                  <td>
                    {item.skills.map((item) => (
                      <b className="m-1" key={item}>
                        {item}
                      </b>
                    ))}
                  </td>
                  <td
                    className={item.active ? "text-success" : "text-secondary"}
                  >
                    {item.active ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <Link
                      className="link"
                      to={`/hr/jobs/JobDeatils/${item._id}`}
                    >
                      More...
                    </Link>
                  </td>
                  <td className="text-center text-dark">
                    {item.loading ? (
                      <LoadingButton
                        size="sm"
                        className={item.active ? "bg-success" : "bg-danger"}
                      />
                    ) : (
                      <Button
                        className={item.active ? "bg-danger" : "bg-success"}
                        onClick={changeStatus}
                      >
                        {item.active ? "Stop Hiring" : "Start Hiring"}
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div>
          <h5 className="text-center">No Datas Available Here!</h5>
        </div>
      )}

      <>
        <Pagination
          page={page}
          next={next}
          prev={prev}
          total={total}
          limit={limit}
          setPage={setPage}
        />
      </>
    </div>
  );
}

export default ListJobs;
