import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../loading/Loading";
import { PieChart } from "../pieChart/PieChart";
import { downloadHRDashboardDatas, getHRDashboardDatas } from "../../services/hrServices";
import { VerticalBar } from "../verticalBarChart/VerticalBarChart";
import { Button } from "react-bootstrap";
import { saveAs } from 'file-saver';

function HrDashboard() {
  const [state, setState] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHRDashboardDatas()
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

  const downloadReport = async () => {
  try {
    downloadHRDashboardDatas().then((data)=>{
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'placements.xlsx');
    })
  } catch (err) {
    console.error(err);
  }
};

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center mx-auto my-5">
          <Loading />
        </div>
      ) : state ? (
        <>
          <div className="datas_div rounded d-flex px-5 py-4 m-3  align-items-center justify-content-evenly flex-wrap">
            <div className="p-2 px-4 border-info data_div flex-fill rounded ">
              <h5> Job Posts </h5> <h6> {state.jobs}</h6>
            </div>
            <div className="p-2 px-4 border-danger data_div flex-fill rounded ">
              <h5> No of Applications </h5> <h6> {state.totalApplicants}</h6>
            </div>
            <div className="p-2 px-4 border-warning data_div flex-fill rounded ">
              <h5> No of Departments </h5> <h6> {state.totaldepartments}</h6>
            </div>
            <div className="p-2 px-4 border-success data_div flex-fill rounded ">
              <h5> No of Hirings</h5> <h6> {state.totalPlacements}</h6>
            </div>
          </div>
          <div className="d-flex flex-wrap my-3 mx-auto gap-3">
            <div className="Vertical_chart p-4 bg-white rounded">
            <VerticalBar datas={state.analysis} />
            </div>
            <div className="doughnut_chart p-4 bg-white rounded">
              <PieChart datas={state.statusCount} />
            </div>
          </div>
          <div className="d-flex me-auto" ><Button onClick={downloadReport}>Download Report</Button></div>
        </>
      ) : (
        "something went wrong"
      )}
    </>
  );
}

export default HrDashboard;
