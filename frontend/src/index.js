import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import DesignState from "./context/DesignContext/designState";
import SecurityState from "./context/Security/securityState";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DesignState>
        <SecurityState>
          <App />
        </SecurityState>
      </DesignState>
    </BrowserRouter>
  </React.StrictMode>
);
