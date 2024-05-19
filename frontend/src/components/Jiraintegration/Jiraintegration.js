import React, { useContext, useEffect, useRef, useState } from "react";
import AceEditor from "react-ace";
import { Stack, StackItem } from "@fluentui/react";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import axios from "axios";
import "./Jiraintegration.css";
import Mermaid from "./Mermaid";
import DesignContext from "../../context/DesignContext/designContext";

const Jiraintegration = () => {
  const [issues, setIssues] = useState();
  const aceEditor = useRef();
  const [loading, setLoading] = useState(false);
  const [github, setGithub] = useState();
  const [codeObj, setCodeObj] = useState();
  const { mermaidData, getMermaidData } = useContext(DesignContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the Axios GET request
        const response = await axios.get(
          "http://127.0.0.1:5000/api/fetch-issues"
        );

        setIssues(response.data["issues"]);
      } catch (error) {
        // Handle errors
        console.error("Error fetching data:", error);
      }
    };

    // Call the fetch data function when component mounts
    fetchData();
  }, []);

  const githubContent = async (desc) => {
    const response = await axios.get(
      "http://127.0.0.1:5000/api/github_contents"
    );
    setGithub(response.data["output"]);
    designDocument(desc, response.data["output"]);
    return response.data["output"];
  };

  const designDocument = async (desc, files) => {
    let response = await axios.post("http://127.0.0.1:5000/api/design-jira", {
      jira: desc,
      files: files,
    });
    console.log("mermaid : ", response.data.data);
    try {
      setLoading(true);
      await getMermaidData(JSON.parse(response.data.data));
    } finally {
      setLoading(false);
    }
  };

  const developmentJira = async (desc, files) => {
    let response = await axios.post(
      "http://127.0.0.1:5000/api/development-jira",
      {
        jira: desc,
        files: files,
      }
    );
    console.log("code : ", JSON.parse(response.data.data));
    setCodeObj(JSON.parse(response.data.data));
  };

  const handleStart = (desc) => {
    let files = githubContent(desc);

    developmentJira(desc, files);
  };

  return (
    <>
      <div
        style={{ margin: "auto", display: "flex", justifyContent: "center" }}
      >
        <table className="custom-table">
          <thead>
            <tr>
              <th>Jira Issue ID</th>
              <th>Project Name</th>
              <th>Jira Title</th>
              <th>Description</th>
              <th>Assigner</th>
              <th>Time Stamp</th>
              <th>Process</th>
            </tr>
          </thead>
          <tbody>
            {issues &&
              issues.map((item) => (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.project_name}</td>
                  <td>{item.summary}</td>
                  <td>{item.description}</td>
                  <td>{item.assigner}</td>
                  <td>{item.time}</td>
                  <td>
                    <button
                      className="cospace_table_button"
                      onClick={() => handleStart(item.description)}
                    >
                      Start
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div>
        <Stack verticalFill>
          <StackItem>
            {loading
              ? "Loading"
              : mermaidData && <Mermaid chart={mermaidData} />}
          </StackItem>

          <StackItem>
            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <StackItem>
                {codeObj && codeObj["code"] && (
                  <AceEditor
                    ref={aceEditor}
                    mode="python"
                    theme="monokai"
                    value={codeObj["code"]}
                    style={{ margin: 16 }}
                    name="Development"
                    editorProps={{ $blockScrolling: true }}
                    debounceChangePeriod={3}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                    }}
                  ></AceEditor>
                )}
              </StackItem>

              <StackItem>
                {codeObj && codeObj["test_cases"] && (
                  <AceEditor
                    mode="python"
                    theme="github"
                    readOnly={true}
                    style={{ margin: 16 }}
                    name="Test Cases"
                    editorProps={{ $blockScrolling: true }}
                    value={codeObj["test_cases"]}
                    setOptions={{
                      enableBasicAutocompletion: true,
                      enableLiveAutocompletion: true,
                      enableSnippets: true,
                    }}
                  ></AceEditor>
                )}
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </div>
    </>
  );
};

export default Jiraintegration;
