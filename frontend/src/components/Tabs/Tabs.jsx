import React from "react";
import "./Tabs.css";
import { Link } from "react-router-dom";

const Tabs = ({ title, imageSrc, tabLink }) => {
  return (
    <Link to={tabLink}>
      <div className="tabs_container">
        <h3 className="tabs_title">{title}</h3>
        <img src={imageSrc} alt="" className="tabs_icon" />
      </div>
    </Link>
  );
};

export default Tabs;
