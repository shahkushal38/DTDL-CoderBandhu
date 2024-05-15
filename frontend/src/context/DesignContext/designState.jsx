import { useState } from "react";
import DesignContext from "./designContext";
import axios from 'axios';
import { chartTypes } from "../../utils/design";


const sampleoutput = `
flowchart LR\nsubgraph Library Management System\n    A[Start]\n    B[Add Book] --> C[Add Book to Database]\n    C --> D[Add Book to Shelf]\n    E[Borrow Book] --> F[Check if Book is Available]\n    F[Yes] --> G[Lend Book]\n    F[No] --> H[Inform User]\n    I[Return Book] --> J[Update Database]\n    J[Yes] --> K[Return Book to Shelf]\n    J[No] --> L[Inform User]\n    M[End]\nend\n
`;
const GEMENI_KEY = process.env.REACT_APP_GEMENI_KEY ?? "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMENI_KEY;
const headers = {
    "Content-Type": "application/json"
}

function DesignState({ children }) {
    const [mermaidData, setMermaidData] = useState("");
    const getMermaidData = async (inputData) => {
        const inputtext = "Generate mermaid js \'" + chartTypes[Number(inputData.chartType)].name + " code\' for \'" + inputData.chartInput + "\' . example of mermaid js " + chartTypes[Number(inputData.chartType)].name + " is \'" + chartTypes[Number(inputData.chartType)].code + "\'";

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
            ]
        }

        await axios
            .post(BASE_URL, formData, headers)
            .then(function (response) {
                let res = response.data;
                res = res.candidates[0].content.parts[0].text;
                res = res.substr(res.indexOf("\n", res.indexOf("```mermaid")) + 1);
                res = res.substr(0, res.length - 3);
                setMermaidData(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <DesignContext.Provider
            value={{
                getMermaidData,
                mermaidData
            }}
        >
            {children}
        </DesignContext.Provider>
    );
}
export default DesignState;