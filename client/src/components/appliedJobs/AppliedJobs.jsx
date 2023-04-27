import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  appliedJobs,
  applyJob,
  cancelJobApplication,
} from "../../services/userServices";
import { toast } from "react-toastify";
import { MdOutlineLocationOn } from "react-icons/md";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";
import LoadingButton from "../loadingButton/LoadingButton";
import SearchBar from "../searchBar/SearchBar";
import Swal from "sweetalert2";

function AppliedJobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState();
  const [limit, setLimit] = useState();
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect for calling api
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("userAuthToken");
    if (!token || token === "undefined") return navigate("/login");
    // fetching the datas
    appliedJobs(page)
      .then((data) => {
        setLoading(false);
        if (data.status) {
          setPage(data.page);
          setNext(data.next);
          setPrev(data.previous);
          setTotal(data.total);
          setLimit(data.limit);
          const d = data.result;
          console.log(d);
          setJobs(
            d.map((jobs) => ({
              ...jobs,
              applyLoading: false,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, navigate]);

  return (
    <div className="jobs_parent_div my-3 p-3">
      <div className="mb-4">
        <h1>
          Applied <span className="text-primary">Jobs</span>
        </h1>
        <h6 className="text-secondary">Your applied jobs, all in one place.</h6>
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
                confirmButtonText: "Yes!",
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
                        toast.success(data.message, { autoClose: 1000 });
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
                  <h4 className="text-primary">{item.job_type}</h4>
                  <span className="text-secondary">
                    <MdOutlineLocationOn /> {item.location}
                  </span>
                  <span className="text-secondary ms-4">
                    &#x20b9; {item.min_salary + " - " + item.max_salary}
                  </span>
                  <p>
                    {item.description.split(" ").slice(0, 30).join(" ")}
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
            <h5 className="text-center">No Matching Jobs Found</h5>
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
