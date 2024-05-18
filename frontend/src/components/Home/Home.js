import React from "react";
import "./Home.css";
import Tabs from "../Tabs/Tabs";

const Home = () => {
  return (
    <div className="home_container">
      <div className="lakshya_bot">
        <input
          type="text"
          className="home_desc"
          placeholder="Describe your idea and let our लक्ष्यBot help you decide the plan of action"
        />
        <button type="submit" className="design_submit_button">
          Submit
        </button>
      </div>
      <div className="or-separator">
        <span className="or">OR</span>
      </div>
      <div className="home_nav_tabs">
        <Tabs title="DESIGN" tabLink={"/design"} imageSrc="./design_logo.png" />
        <Tabs
          title="Development"
          tabLink={"/development"}
          imageSrc="./dev_logo.png"
        />
        <Tabs
          title="Testing"
          tabLink={"/testing"}
          imageSrc="./testing_logo.png"
        />
        <Tabs
          title="Security"
          tabLink={"/security"}
          imageSrc="./security_logo.png"
        />
        <Tabs
          title="Deployment"
          tabLink={"/deployment"}
          imageSrc="./deployment_logo.png"
        />
        <Tabs
          title="CoSpace"
          tabLink={"/cospace"}
          imageSrc="./cospace_logo.png"
        />
      </div>
      <div className="bottom_container">
        <img
          src="./chat_bot.png"
          alt="Chatbot"
          className="bottom-right-image"
        />
      </div>
    </div>
  );
};

export default Home;
