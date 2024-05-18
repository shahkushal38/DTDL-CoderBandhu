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

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Vulnerabilities",
    },
  },
};

function BarChart({ barDetails }) {
  return (
    <div style={{ width: "100%" }}>
      <Bar
        options={options}
        data={{
          labels: Object.keys(barDetails).map((item) => item),
          datasets: [
            {
              label: "Counts",
              data: Object.values(barDetails).map((item) => item),
              backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
          ],
        }}
      />
    </div>
  );
}
export default BarChart;
