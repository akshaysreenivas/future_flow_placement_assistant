import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

 const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Total Placements Per Month",
    },
  },
};

export function VerticalBar({ datas }) {
  let labels = [];
  let values = [];
  values = datas?.map((item) => item.count);
  labels = datas?.map((item) => item.month);

  const data = {
    labels,
    datasets: [
      {
        label: "No of Placements",
        data: values,
        backgroundColor: "green",
      },
    ],
  };
  return <Bar options={options} data={data} />;
}
