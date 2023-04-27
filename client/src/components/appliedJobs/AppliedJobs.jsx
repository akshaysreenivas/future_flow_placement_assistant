import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { appliedJobs, applyJob, cancelJobApplication } from "../../services/userServices";
import { toast } from "react-toastify";
import { MdOutlineLocationOn } from "react-icons/md";
import Pagination from "../pagination/Pagination";
import Loading from "../loading/Loading";
import LoadingButton from "../loadingButton/LoadingButton";

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
        toast.error(error,"Something Went Wrong");
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, navigate]);

  return (
    <div className="">
      <div className="mb-4">
        <h3 className="">
          Jobs that are applied.
        </h3>
      </div>
     
    
      <div className="JobsDi m-3 ">
        {loading ? (
          <div className="d-flex justify-content-center mx-auto my-5">
            <Loading />
          </div>
        ) : jobs.length ? (
          jobs.map((item) => {
            const handleApply = () => {
              try {

                const newJobs = [...jobs];
                // finding the current row
                const jobsIndex = newJobs.findIndex((u) => u._id === item._id);
                // setting the loading animation
                newJobs[jobsIndex].applyLoading = true;
                setJobs(newJobs);
                // applying for the job
                applyJob(item._id).then((data) => {
                    if (data.status) {
                      newJobs[jobsIndex].isApplied = true;
                      setJobs(newJobs);
                      toast.success(data.message,{autoClose:1000});
                    }
                });
              } catch (err) {
                toast.error("Something went wrong",{autoClose:1000});
              } finally {
                const updatedJobs = [...jobs];
                const jobsIndex = updatedJobs.findIndex(
                  (u) => u._id === item._id
                );
                updatedJobs[jobsIndex].applyLoading = false;
                setJobs(updatedJobs);
              }
            };
            const handleCancel = () => {
              try {
                const newJobs = [...jobs];
                // finding the current row
                const jobsIndex = newJobs.findIndex((u) => u._id === item._id);
                // setting the loading animation
                newJobs[jobsIndex].applyLoading = true;
                setJobs(newJobs);
                // applying for the job
                cancelJobApplication(item._id).then((data) => {
                    if (data.status) {
                      newJobs[jobsIndex].isApplied = false;
                      setJobs(newJobs);              
                    toast.success(data.message,{autoClose:1000});
                  }
                });
              } catch (err) {
                toast.error("Something went wrong",{autoClose:1000});
              } finally {
                const updatedJobs = [...jobs];
                const jobsIndex = updatedJobs.findIndex(
                  (u) => u._id === item._id
                );
                updatedJobs[jobsIndex].applyLoading = false;
                setJobs(updatedJobs);
              }
            };
            return (
              <div key={item._id} className="job_di gap-2 p-3  my-3">
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
                  <div className="action_btn_div">
                    {item.applyLoading ? (
                      <LoadingButton
                        size="sm"
                        className="apply_btn text-white py-1 px-5"
                      />
                    ) : (

                      item.isApplied ? <button  onClick={handleCancel}  className="apply_btn text-white py-1 px-4">Cancel</button>:
                      <button onClick={handleApply} className="apply_btn text-white py-1 px-3">Apply Now</button>
                     
                    )}

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
