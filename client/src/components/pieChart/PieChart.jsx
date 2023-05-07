import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import randomColor from "randomcolor";

export function PieChart({ datas }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  let labels = [];
  let values = [];
  labels = datas.map((item) => item.status);
  values = datas.map((item) => item.count);
  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Current Application Response",
    },
  },
};
  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data:values,
        backgroundColor: randomColor({
          count: values.length,
          luminosity: "bright",
          format: "rgba",
          alpha:1,
        }),
        borderWidth: 1,
      },
    ],
  };

  return <Pie options={options} data={data} />;
}
