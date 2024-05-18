import React, { useState } from "react";
import "./CoSpace.css";

const CoSpace = () => {
  const [meetInfo, setMeetInfo] = useState({
    id: "",
    pass: "",
    username: "",
  });
  return (
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
            onChange={(e) => setMeetInfo({ ...meetInfo, pass: e.target.value })}
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
    </div>
  );
};

export default CoSpace;
