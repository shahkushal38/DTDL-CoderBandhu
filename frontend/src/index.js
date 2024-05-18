import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DesignState from "./context/DesignContext/designState";
import SecurityState from "./context/Security/securityState";
import { BrowserRouter } from "react-router-dom";
import DevelopmentState from "./context/Development/developmentState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DesignState>
        <DevelopmentState>
          <SecurityState>
            <App />
          </SecurityState>
        </DevelopmentState>
      </DesignState>
    </BrowserRouter>
  </React.StrictMode>
);
