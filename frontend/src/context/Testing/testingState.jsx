import { useState } from "react";
import axiosClient from "./../../services/axios-client";
import TestingContext from "./testingContext";

function TestingState({ children }) {
    const [testcases, setTestcases] = useState("");
    const getTestcases = async (inputData) => {
        const formData =
        {
            "user_code": inputData.code,
        }
        console.log(formData)
        await axiosClient
            .post("api/testing", formData)
            .then(function (response) {
                let res = response.data;
                res = res.test_code;
                console.log(res)

                setTestcases(res);
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    return (
        <TestingContext.Provider
            value={{
                testcases,
                getTestcases
            }}
        >
            {children}
        </TestingContext.Provider>
    );
}
export default TestingState;