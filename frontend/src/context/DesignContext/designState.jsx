import { useState } from "react";
import DesignContext from "./designContext";
import axiosClient from "./../../services/axios-client";


const sampleoutput = `
flowchart LR\nsubgraph Library Management System\n    A[Start]\n    B[Add Book] --> C[Add Book to Database]\n    C --> D[Add Book to Shelf]\n    E[Borrow Book] --> F[Check if Book is Available]\n    F[Yes] --> G[Lend Book]\n    F[No] --> H[Inform User]\n    I[Return Book] --> J[Update Database]\n    J[Yes] --> K[Return Book to Shelf]\n    J[No] --> L[Inform User]\n    M[End]\nend\n
`;

function DesignState({ children }) {
    const [mermaidData, setMermaidData] = useState("");
    const getMermaidData = async (inputData) => {
        console.log(inputData)
        const formData =
        {
            "user_input":
            {
                "prompt": inputData.chartInput,
                "diagram_type": inputData.chartType
            }
        }
        await axiosClient
            .post("api/design", formData)
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