import React, { useState, useEffect } from "react";
import "./CoSpace.css";
import ChatBot from "react-simple-chatbot";
import FetchData from "../FetchData/FetchData";
import { ThemeProvider } from "styled-components";
import axiosClient from "../../services/axios-client";

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
  const [meetings, setMeetings] = useState([]);
  const [firstMessage, setFirstMessage] = useState();

  const addMeeting = async()=>{
    await axiosClient
      .post("api/add_meeting")
      .then(function (response) {
        console.log(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const getChat = async () => {
    await axiosClient
      .post("api/get_chat")
      .then(function (response) {
        setFirstMessage(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    (async () => {
      await axiosClient
        .get("api/meetings")
        .then(function (response) {
          setMeetings(response.data.meetings);
        })
        .catch(function (error) {
          console.log(error);
        });
    })();
  }, []);

  const step = [
    {
      id: "1",
      message: firstMessage,
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
      user: true,
      trigger: "2",
    },
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
            onClick={() =>{
              addMeeting()
              window.open(
                `http://localhost:3001?username=${meetInfo.username}`,
                "_blank"
              )
            }
              
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
              {meetings.map((row, index) => (
                <tr key={index}>
                  <td>{row.meeting_id}</td>
                  <td>{row.agenda}</td>
                  <td className="narrow_column">
                    <button
                      className="cospace_table_button"
                      onClick={() => {
                        localStorage.setItem("meetId", row.meeting_id);
                        getChat();
                      }}
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
      {firstMessage && (
        <ChatBot headerTitle="CoSpace Bot" steps={step} floating={true} />
      )}
    </ThemeProvider>
  );
};

export default CoSpace;
