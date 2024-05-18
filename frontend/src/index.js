import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DesignState from "./context/DesignContext/designState";
import SecurityState from "./context/Security/securityState";
import { BrowserRouter } from "react-router-dom";
import DevelopmentState from "./context/Development/developmentState";
import TestingState from "./context/Testing/testingState";
import { render } from "react-dom";

// const root = ReactDOM.createRoot(document.getElementById("root"));
render(
  // <React.StrictMode>
  <BrowserRouter>
    <DesignState>
      <DevelopmentState>
        <TestingState>
          <SecurityState>
            <App />
          </SecurityState>
        </TestingState>
      </DevelopmentState>
    </DesignState>
  </BrowserRouter>,
  // </React.StrictMode>
  document.getElementById("root")
);
