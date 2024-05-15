import { useState } from "react";
import SecurityContext from "./securityContext";
import axios from 'axios';


const sampleoutput = `
"**Vulnerability Analysis**\n\n**1. SQL Injection Vulnerability**\n* **Affected Component:** Login function\n* **Description:** The login function constructs an SQL query by concatenating user input directly into the query string. This allows an attacker to include malicious SQL commands in their input, which can be executed when the query is executed. This could lead to unauthorized access or modification of the database.\n\n**2. Sensitive Data Exposure**\n* **Affected Component:** read_file function\n* **Description:** The read_file function does not perform input validation, allowing an attacker to read any file on the server. This could expose sensitive data such as passwords, configuration files, or other private information.\n\n**Vulnerability Report**\n\n* Total Vulnerabilities: 2\n* Vulnerabilities:\n    * SQL Injection Vulnerability: 1\n    * Sensitive Data Exposure: 1"
`;
const GEMENI_KEY = process.env.REACT_APP_GEMENI_KEY ?? "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMENI_KEY;
const headers = {
    "Content-Type": "application/json"
}

var samplequery = `
Generate vulnerability report for all the vulnerabilities found in the below code based on the following format, 

total_vulnerabilities = INTEGER
Vulnerabilities = array of map [{name: STRING, line_number: INTEGER}, {name: STRING, line_number: INTEGER}] 

Example: 
total_vulnerabilities = 2
Vulnerabilities = [{'name': 'Cross Site Scripting', line_number: 3}, {'name' :'InsecureDependencies', line_number: 2 }]

Code:
'
import sqlite3
import os

def login(username, password):
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'"c.execute(query)
    result = c.fetchone()
    
    conn.close()
    
    return result

def read_file(filename):
    with open(filename, 'r') as file:
        data = file.read()
    print(data)
'

`;

var instructions = `
Scan and Generate vulnerability report for all the vulnerabilities found in the below code based on the following format, 

total_vulnerabilities = INTEGER
Vulnerabilities = array of map [{'name': STRING, 'line_number': INTEGER}, {'name': STRING, 'line_number': INTEGER}] 

Example: 
total_vulnerabilities = 2
Vulnerabilities = [{'name': 'Cross Site Scripting', 'line_number': 3}, {'name' :'InsecureDependencies', 'line_number': 2 }]

Code: 

`;
function SecurityState({ children }) {
    const [vulnerabilityReport, setVulnerabilityReport] = useState([]);
    const getVulnerabilityReport = async (inputData) => {
        const inputtext = instructions + inputData.codeInput;
        const formData =
        {
            "contents": [
                {
                    "parts": [
                        {
                            "text": inputtext
                        }
                    ]
                }
            ],
            "safety_settings": [
                {
                    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                    "threshold": "BLOCK_NONE"
                }
            ]
        }

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