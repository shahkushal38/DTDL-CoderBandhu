import { useState } from "react";
import LakshaBotContext from "./lakshaBotContext";
import axiosClient from "./../../services/axios-client";

function LakshaBotState({ children }) {
  const [markdownFile, setMarkdownFile] = useState("");
  const getMarkdownFile = async (inputData) => {
    console.log(inputData);
    const formData = {
      user_input: inputData,
    };
    await axiosClient
      .post("api/lakshya-bot", formData)
      .then(function (response) {
        let res = response.data;
        res = res.output;
        res = res.toString();
        console.log(res.toString());
        setMarkdownFile(res);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <LakshaBotContext.Provider
      value={{
        getMarkdownFile,
        markdownFile,
      }}
    >
      {children}
    </LakshaBotContext.Provider>
  );
}
export default LakshaBotState;
