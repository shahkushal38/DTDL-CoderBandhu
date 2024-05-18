import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  Title,
  BarElement,
  LinearScale,
} from "chart.js";
import PieChart from "./PieChart";
import DetailTable from "./DetailTable";
import BarChart from "./BarChart";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function SecurityCharts({ vulnerabilityReport }) {
  console.log(vulnerabilityReport);
  //   const [treport, settreport] = useState([
  //     { name: "SQL Injection", line_number: 10 },
  //     { name: "CWE-22", line_number: 13 },
  //   ]);
  const [pieMap, setPieMap] = useState({});

  useEffect(() => {
    var tmap = {};
    vulnerabilityReport.map((item) => {
      if (item.name in tmap) {
        tmap[item.name]++;
      } else {
        tmap[item.name] = 1;
      }
    });
    setPieMap(tmap);
  }, [vulnerabilityReport]);
  console.log(pieMap);

  return (
    <div style={{ maxWidth: "100%" }}>
      <h2
        style={{
          textAlign: "center",
        }}
      >
        Reports
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "65vh",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <PieChart pieMap={pieMap} />
          <BarChart barDetails={pieMap} />
        </div>
        <div>
          <DetailTable tableDetails={pieMap} />
        </div>
      </div>
    </div>
  );
}

export default SecurityCharts;
