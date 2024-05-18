import { useState } from "react";
import DevelopmentContext from "./developmentContext";
import axiosClient from "./../../services/axios-client";

function DevelopmentState({ children }) {
    const [outputCode, setOutputCode] = useState("");
    const getDevelopmentCode = async (inputData) => {
        const formData =
        {
            "user_input": {
                "user_prompt": inputData.prompt,
                "user_code": inputData.code,
                "type": "rename"
            }
        }

        await axiosClient
            .post("api/develop", formData)
            .then(function (response) {
                let res = response.data;
                console.log("resL ", res)
                res = res.data
                res = res.toString()
                setOutputCode(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <DevelopmentContext.Provider
            value={{
                getDevelopmentCode,
                outputCode
            }}
        >
            {children}
        </DevelopmentContext.Provider>
    );
}
export default DevelopmentState;