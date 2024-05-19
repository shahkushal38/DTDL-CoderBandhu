import React, { useContext, useEffect, useState } from "react";
import "./Home.css";
import Tabs from "../Tabs/Tabs";
import LakshaBotContext from "../../context/LakshaBot/lakshaBotContext";
import MarkdownToPdf from "../Laskhabot/CustomMarkdown";

const Home = () => {
  const { markdownFile, getMarkdownFile } = useContext(LakshaBotContext);
  const [loading, setLoading] = useState(false);

  const [inputData, setInputData] = useState("");
  const handleSubmit = async (e) => {
    try {
      console.log("hey");
      setLoading(true);
      await getMarkdownFile(inputData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (markdownFile) {
      console.log(markdownFile);
    }
  }, [markdownFile]);

  console.log(markdownFile);
  return (
    <div className="home_container">
      <div className="lakshya_bot">
        <input
          type="text"
          className="home_desc"
          placeholder="Describe your idea and let our लक्ष्यBot help you decide the plan of action"
          onChange={(e) => setInputData(e.target.value)}
        />
        <button
          type="submit"
          className="design_submit_button"
          onClick={handleSubmit}
        >
          {loading ? "Loading" : "Submit"}
        </button>
        <MarkdownToPdf />
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
