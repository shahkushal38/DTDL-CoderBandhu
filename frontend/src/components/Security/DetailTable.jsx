import React from "react";
import "./Security.css";
function DetailTable({ tableDetails }) {
  return (
    <div style={{ width: "100%" }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Vulnerability</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(tableDetails).map((item, key) => (
            <tr key={key}>
              <td>{key + 1}</td>
              <th>{item}</th>
              <td>{tableDetails[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailTable;
