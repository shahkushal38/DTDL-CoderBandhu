import { useState } from "react";
import DevelopmentContext from "./developmentContext";
import axios from 'axios';


const sampleoutput = `
def foo(num1):\n    print(num1)\n
`;

const sampleinput = `
generate new code with 'the variable msg should be renamed to num1' for code: 'def foo(msg): print(msg) '. The code must be returned with proper language specific indentation. Example: The variable a and b should be renamed to num1 and num2 output for code: 'def is_equal(a, b): return a == b 'output: def is_equal(num1, num2): return num1 == num2`;

const GEMENI_KEY = process.env.REACT_APP_GEMENI_KEY ?? "";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMENI_KEY;
const headers = {
    "Content-Type": "application/json"
}

function DevelopmentState({ children }) {
    const [outputCode, setOutputCode] = useState("");
    const getDevelopmentCode = async (inputData) => {
        const inputtext = "generate new code with \'" + inputData.prompt + " for code: \' for \'" + inputData.code + "\' . Example: The variable a and b should be renamed to num1 and num2 for code: 'def is_equal(a, b):\n\treturn a == b' output: 'def is_equal(num1, num2):\n\treturn num1 == num2'";
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