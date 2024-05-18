import React from "react";
import "./SideNavbar.css";
import { Link, useLocation } from "react-router-dom";

const SideNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="side_nav_container">
      <div className="side_nav">
        <img className="coderbandhu" src="./logo.png" alt="logo" />
        <div className="nav_points">
          <ul className="nav_list">
            <Link to="">
              <li className={`nav_item ${currentPath === "/" ? "active" : ""}`}>
                <img src="./dashboard_logo.png" alt="" />
                <p>Dashboard</p>
              </li>
            </Link>
            <Link to="design">
              <li
                className={`nav_item ${currentPath === "/design" ? "active" : ""
                  }`}
              >
                <img src="./design_logo.png" alt="" className="yellow_logo" />
                <p>Design</p>
              </li>
            </Link>
            <Link to="development">
              <li
                className={`nav_item ${currentPath === "/development" ? "active" : ""
                  }`}
              >
                <img src="./dev_logo.png" alt="" className="yellow_logo" />
                <p>Development</p>
              </li>
            </Link>
            <Link to="testing">
              <li
                className={`nav_item ${currentPath === "/testing" ? "active" : ""
                  }`}
              >
                <img src="./testing_logo.png" alt="" className="yellow_logo" />
                <p>Testing</p>
              </li>
            </Link>
            <Link to="security">
              <li
                className={`nav_item ${currentPath === "/security" ? "active" : ""
                  }`}
              >
                <img src="./security_logo.png" alt="" className="yellow_logo" />
                <p>Security</p>
              </li>
            </Link>
            <Link to="deployment">
              <li
                className="nav_item"
                sName={`nav_item ${currentPath === "/deployment" ? "active" : ""
                  }`}
              >
                <img
                  src="./deployment_logo.png"
                  alt=""
                  className="yellow_logo"
                />
                <p>Deployment</p>
              </li>
            </Link>
            <Link to="cospace">
              <li
                className={`nav_item ${currentPath === "/cospace" ? "active" : ""
                  }`}
              >
                <img src="./cospace_logo.png" alt="" className="yellow_logo" />
                <p>CoSpace</p>
              </li>
            </Link>

            <li
              className={`nav_item ${currentPath === "/contact" ? "active" : ""
                }`}
            >
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
