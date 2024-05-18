import React, { useEffect, useState } from "react";

import "./App.css";
import { ZoomMtg } from "@zoom/meetingsdk";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function App() {
  var authEndpoint = "http://localhost:4000";
  var sdkKey = "hMkhHBovQeun15fsMCrexg";
  var meetingNumber = "2432056625";
  var passWord = "wH0qT8";
  var role = 0;
  var userName = new URLSearchParams(window.location.search).get("username");
  var userEmail = "shreyatiwari2212@gmail.com";
  var registrantToken = "";
  var zakToken = "";
  var leaveUrl = "http://localhost:3000";

  function getSignature() {
    // e.preventDefault();

    fetch(authEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        startMeeting(response.signature);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function startMeeting(signature) {
    document.getElementById("zmmtg-root").style.display = "block";

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      patchJsMedia: true,
      success: (success) => {
        console.log(success);

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success);
          },
          error: (error) => {
            console.log(error);
          },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  useEffect(() => {
    getSignature();
  });

  return (
    <div className="App">
      <main></main>
    </div>
  );
}

export default App;
