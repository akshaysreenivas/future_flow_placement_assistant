import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import randomColor from "randomcolor";

function DoughnutChart({ datas }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  let labels = [];
  let values = [];
  labels = datas.map((item) => item.company);
  values = datas.map((item) => item.count);
  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Placements By Companys",
    },
  },
};
  const data = {
    labels,
    datasets: [
      {
        label: "No of Placemants",
        data:[...values ,5,6],
        backgroundColor: randomColor({
          count: values.length + 2,
          luminosity: "bright",
          format: "rgba",
          alpha:1,
        }),
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut options={options} data={data} />;
}

export default DoughnutChart;
