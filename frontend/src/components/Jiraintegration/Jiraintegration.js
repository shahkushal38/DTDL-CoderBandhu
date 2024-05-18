import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Jiraintegration.css";

const Jiraintegration = () => {
  const [issues, setIssues] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the Axios GET request
        const response = await axios.get(
          "http://127.0.0.1:5000/api/fetch-issues"
        );

        setIssues(response.data["issues"]);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetch data function when component mounts
    fetchData();
  }, []);

  const handleStart = (id) => {
    console.log(id);
  };

  return (
    <div style={{ margin: "auto", display: "flex", justifyContent: "center" }}>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Jira Issue ID</th>
            <th>Project Name</th>
            <th>Jira Title</th>
            <th>Description</th>
            <th>Assigner</th>
            <th>Time Stamp</th>
            <th>Process</th>
          </tr>
        </thead>
        <tbody>
          {issues &&
            issues.map((item) => (
              <tr>
                <td>{item.id}</td>
                <td>{item.project_name}</td>
                <td>{item.summary}</td>
                <td>{item.description}</td>
                <td>{item.assigner}</td>
                <td>{item.time}</td>
                <td>
                  <button
                    className="cospace_table_button"
                    onClick={() => handleStart(item.id)}
                  >
                    Start
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jiraintegration;
