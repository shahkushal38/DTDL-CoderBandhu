import { useState } from "react";
import SecurityContext from "./securityContext";
import axios from 'axios';
import axiosClient from "./../../services/axios-client";


const sampleoutput = `
"**Vulnerability Analysis**\n\n**1. SQL Injection Vulnerability**\n* **Affected Component:** Login function\n* **Description:** The login function constructs an SQL query by concatenating user input directly into the query string. This allows an attacker to include malicious SQL commands in their input, which can be executed when the query is executed. This could lead to unauthorized access or modification of the database.\n\n**2. Sensitive Data Exposure**\n* **Affected Component:** read_file function\n* **Description:** The read_file function does not perform input validation, allowing an attacker to read any file on the server. This could expose sensitive data such as passwords, configuration files, or other private information.\n\n**Vulnerability Report**\n\n* Total Vulnerabilities: 2\n* Vulnerabilities:\n    * SQL Injection Vulnerability: 1\n    * Sensitive Data Exposure: 1"
`;

function SecurityState({ children }) {
    const [vulnerabilityReport, setVulnerabilityReport] = useState([]);
    const getVulnerabilityReport = async (inputData) => {
        const formData =
        {
            "user_input": {
                "user_code": inputData.codeInput
            }
        }

        await axiosClient
            .post("api/security", formData)
            .then(function (response) {
                let res = response.data;
                res = res.data
                res = res.toString()
                console.log(res.toString());
                res = res.substr(res.indexOf("\n", res.indexOf("```mermaid")) + 1);
                res = res.substr(0, res.length - 3);
                setMermaidData(res);
            })
            .catch(function (error) {
                console.log(error);
            });
        await axios
            .post(BASE_URL, formData, headers)
            .then(function (response) {
                let res = response.data;
                console.log("res: ", res);
                res = res.candidates[0].content.parts[0].text;
                let start = res.indexOf("=", res.indexOf("total_vulnerabilities"));
                let end = res.indexOf("\n", start);
                let total_vulnerabilities = Number(res.substr(start + 1, end - start - 1));

                start = res.indexOf("=", res.indexOf("Vulnerabilities = "))
                end = res.indexOf("]", start);
                let obj = res.substr(start + 1, end - start);
                obj = obj.trim();
                obj = obj.replace(/'/g, '"');
                console.log(obj);
                obj = JSON.parse(obj);

                setVulnerabilityReport(obj);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <SecurityContext.Provider
            value={{
                vulnerabilityReport,
                getVulnerabilityReport
            }}
        >
            {children}
        </SecurityContext.Provider>
    );
}
export default SecurityState;