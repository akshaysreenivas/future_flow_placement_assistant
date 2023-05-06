import React, { useEffect, useState } from "react";
import { VerticalBar } from "../verticalBarChart/VerticalBarChart";
import "./Dashboard.css";
import { getDashboardDatas } from "../../services/adminServices";
import { toast } from "react-toastify";
import DoughnutChart from "../doughnutChart/DoughnutChart";
import Loading from "../loading/Loading";

function Dashboard() {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardDatas()
      .then((data) => {
        if (data.status) {
          setState(data);
        }
      })
      .catch((error) => {
        toast.error("Something Went Wrong");
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center mx-auto my-5">
          <Loading />
        </div>
      ) : state ? (
        <>
          <div className="datas_div rounded d-flex px-5 py-4 m-3  align-items-center justify-content-evenly flex-wrap">
            <div className="p-2 px-4 border-danger data_div flex-fill rounded ">
              <h5> Students </h5> <h6> {state.students}</h6>
            </div>
            <div className="p-2 px-4 border-warning data_div flex-fill rounded ">
              <h5> HR Managers </h5> <h6> {state.hrManagers}</h6>
            </div>
            <div className="p-2 px-4 border-info data_div flex-fill rounded ">
              <h5> Jobs </h5> <h6> {state.jobs}</h6>
            </div>
            <div className="p-2 px-4 border-success data_div flex-fill rounded ">
              <h5> Total Placements </h5> <h6> {state.totalPlacements}</h6>
            </div>
          </div>
          <div className="d-flex flex-wrap my-3 mx-auto gap-3">
            <div className="Vertical_chart p-4 bg-white rounded">
              <VerticalBar datas={state.analysis} />
            </div>
            <div className="doughnut_chart p-4 bg-white rounded">
              <DoughnutChart datas={state.companys} />
            </div>
          </div>
        </>
      ) : (
        "something went wrong"
      )}
    </>
  );
}

export default Dashboard;