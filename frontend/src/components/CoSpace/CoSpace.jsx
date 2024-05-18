import React, { useState } from "react";
import "./CoSpace.css";
import ChatBot from "react-simple-chatbot";
import axios from "axios";
import FetchData from "../FetchData/FetchData";
import { ThemeProvider } from "styled-components";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Poppins, sans-serif",
  headerBgColor: "#9D2062",
  headerFontColor: "#fff",
  headerFontSize: "15px",
  botBubbleColor: "#9D2062",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

const CoSpace = () => {
  const [meetInfo, setMeetInfo] = useState({
    id: "",
    pass: "",
    username: "",
  });

  const step = [
    {
      id: "1",
      message: "Hi! How can I help you today?",
      trigger: "2",
    },
    {
      id: "2",
      user: true,
      trigger: "3",
    },
    {
      id: "3",
      component: <FetchData />,
      // message: "AA raha {previousValue}",
      asMessage: true,
      trigger: "4",
    },
    {
      id: "4",
      message: "Do you need anything else?",
      trigger: "5",
    },
    {
      id: "5",
      user: true,
      trigger: "2",
    },
  ];

  const data = [
    { date: "2024-05-18", agenda: "Project Kickoff" },
    {
      date: "2024-05-19",
      agenda: "Requirement Gathering",
    },
    { date: "2024-05-20", agenda: "Development Start" },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="cospace_container">
        <h1 className="phase_heading">CoSpace</h1>
        <div className="cospace_creds">
          <div className="cospace_meet">
            <input
              type="text"
              className="meet_id"
              placeholder="Enter meeting id"
              onChange={(e) => setMeetInfo({ ...meetInfo, id: e.target.value })}
            />
            <input
              type="password"
              name=""
              id=""
              className="meet_id meet_password"
              placeholder="Enter meeting password"
              onChange={(e) =>
                setMeetInfo({ ...meetInfo, pass: e.target.value })
              }
            />
            <input
              type="text"
              className="meet_id"
              placeholder="Enter username"
              onChange={(e) =>
                setMeetInfo({ ...meetInfo, username: e.target.value })
              }
            />
          </div>
          <button
            className="meet_join_button"
            onClick={() =>
              window.open(
                `http://localhost:3001?username=${meetInfo.username}`,
                "_blank"
              )
            }
          >
            JOIN MEET
          </button>
        </div>
        <div className="meet_history">
          <h3>Meeting History</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Agenda</th>
                <th className="narrow_column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.agenda}</td>
                  <td className="narrow_column">
                    <button
                      className="cospace_table_button"
                      onClick={() => localStorage.setItem("meetId", row.date)}
                    >
                      View meeting
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ChatBot headerTitle="CoSpace Bot" steps={step} floating={true} />
    </ThemeProvider>
  );
};

export default CoSpace;
