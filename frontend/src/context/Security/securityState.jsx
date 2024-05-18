import { useState } from "react";
import SecurityContext from "./securityContext";
import axiosClient from "./../../services/axios-client";

function SecurityState({ children }) {
    const [vulnerabilityReport, setVulnerabilityReport] = useState([]);
    const getVulnerabilityReport = async (inputData) => {
        const formData =
        {
            "user_input": {
                "user_code": inputData.codeInput
            }
        }
        console.log("input ")
        console.log(formData)
        await axiosClient
            .post("api/security", formData)
            .then(function (response) {
                let res = response.data;
                res = res.data;
                console.log("res: ", res);
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