import { useState } from "react";
import DevelopmentContext from "./developmentContext";
import axiosClient from "./../../services/axios-client";

function DevelopmentState({ children }) {
    const [outputCode, setOutputCode] = useState("");
    const [fromComment, setFromComment] = useState("");
    const [queAns, setQueAns] = useState("");

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
                res = res.data
                res = res.toString()
                setOutputCode(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const getCodeFromComments = async (inputData) => {
        const formData =
        {
            "user_input": {
                "user_prompt": inputData.prompt,
                "user_code": "",
                "type": "generate_from_comment"
            }
        }

        await axiosClient
            .post("api/develop", formData)
            .then(function (response) {

                let res = response.data;

                res = res.data
                res = res.toString()
                res = res.substr(res.indexOf("\n", res.indexOf("```")) + 1);
                res = res.substr(0, res.length - 3);
                setFromComment(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const getQueAndAns = async (inputData) => {
        const formData =
        {
            "user_input": {
                "user_prompt": inputData.prompt,
                "user_code": inputData.code,
                "type": "question_answer"
            }
        }

        await axiosClient
            .post("api/develop", formData)
            .then(function (response) {
                let res = response.data;
                res = res.data
                res = res.toString()
                setQueAns(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    return (
        <DevelopmentContext.Provider
            value={{
                outputCode,
                fromComment,
                queAns,
                getDevelopmentCode,
                getCodeFromComments,
                getQueAndAns,
            }}
        >
            {children}
        </DevelopmentContext.Provider>
    );
}
export default DevelopmentState;