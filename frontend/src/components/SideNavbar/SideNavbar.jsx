import React from "react";
import "./SideNavbar.css";

const SideNavbar = () => {
  return (
    <div className="side_nav_container">
      <div className="side_nav">
        <img src="./logo.png" alt="logo" />
        <div className="nav_points">
          <ul className="nav_list">
            <li className="nav_item">
              <img src="./dashboard_logo.png" alt="" />
              <p>Dashboard</p>
            </li>
            <li className="nav_item">
              <img src="./design_logo.png" alt="" className="yellow_logo" />
              <p>Design</p>
            </li>
            <li className="nav_item">
              <img src="./dev_logo.png" alt="" className="yellow_logo" />
              <p>Development</p>
            </li>
            <li className="nav_item">
              <img src="./testing_logo.png" alt="" className="yellow_logo" />
              <p>Testing</p>
            </li>
            <li className="nav_item">
              <img src="./security_logo.png" alt="" className="yellow_logo" />
              <p>Security</p>
            </li>
            <li className="nav_item">
              <img src="./deployment_logo.png" alt="" className="yellow_logo" />
              <p>Deployment</p>
            </li>
            <li className="nav_item">
              <img src="./cospace_logo.png" alt="" className="yellow_logo" />
              <p>CoSpace</p>
            </li>
            <li className="nav_item">
              <img src="./contact_logo.png" alt="" className="yellow_logo" />
              <p>Contact Us</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
