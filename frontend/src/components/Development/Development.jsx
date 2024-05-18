import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AceEditor from "react-ace";
import { PrimaryButton, Stack, StackItem, TextField } from "@fluentui/react";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import DevelopmentContext from "../../context/Development/developmentContext";

export function Development() {
  const [value, setValue] = useState("");
  const aceEditor = useRef();
  const [outputResult, setOutputResult] = useState();
  const [userPrompt, setUserPrompt] = useState();

  function handleOnSelectionChange(selectedValue, _) {
    const newValue = aceEditor.current.editor.getSelectedText();
    setValue(newValue);
  }

  function handleTextOnChange(_, newValue) {
    setUserPrompt(newValue);
  }

  const {
    getDevelopmentCode,
    outputCode,
    getCodeFromComments,
    fromComment,
    getQueAndAns,
    queAns,
  } = useContext(DevelopmentContext);

  useEffect(() => {
    if (outputCode) {
      setOutputResult(outputCode);
    }
  }, [outputCode]);

  useEffect(() => {
    if (fromComment) {
      console.log("In if - ");
      setOutputResult(fromComment);
    }
  }, [fromComment]);

  useEffect(() => {
    if (queAns) {
      console.log("In if - ");
      setOutputResult(queAns);
    }
  }, [queAns]);

  const handleVariablesClick = useCallback(() => {
    if (value != null && value.length > 0) {
      const inputObject = {
        prompt:
          "Enhance the variable namings of the following code as per the business logic",
        code: value,
      };

      getDevelopmentCode(inputObject);
    }
  }, [value, getDevelopmentCode]);

  const handleGenerateCode = useCallback(() => {
    if (value != null && value.length > 0) {
      const inputObject = {
        prompt: value,
      };

      getCodeFromComments(inputObject);
    }
  }, [value, getCodeFromComments]);

  const handleQueAndAns = useCallback(() => {
    if (value != null && value.length > 0) {
      console.log("Value -- ", value);
      const inputObject = {
        prompt: userPrompt,
        code: value,
      };

      getQueAndAns(inputObject);
    }
  }, [getQueAndAns, value]);

  const handleSelectedCode = useCallback(() => {
    if (value != null && value.length > 0) {
      console.log("Value selected in -- ", value);
      const inputObject = {
        prompt: "Explain the following piece of code",
        code: value,
      };

      getQueAndAns(inputObject);
    }
  }, [getQueAndAns, value]);

  return (
    <>
      <Stack verticalFill>
        <StackItem>
          <h1 className="phase_heading">Development Phase </h1>
        </StackItem>

        <StackItem>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <StackItem>
              <AceEditor
                ref={aceEditor}
                mode="python"
                theme="monokai"
                onSelectionChange={handleOnSelectionChange}
                name="Development"
                editorProps={{ $blockScrolling: true }}
                debounceChangePeriod={3}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
              ></AceEditor>

              <Stack horizontal tokens={{ childrenGap: 16 }}>
                <StackItem>
                  <PrimaryButton
                    text="Improve Variable Naming"
                    onClick={handleVariablesClick}
                  />
                </StackItem>
                <StackItem>
                  <PrimaryButton
                    text="Generate code"
                    onClick={handleGenerateCode}
                  />
                </StackItem>
                <StackItem>
                  <PrimaryButton
                    text="Understand Selected code"
                    onClick={handleSelectedCode}
                  />
                </StackItem>
              </Stack>

              <Stack verticalFill>
                <StackItem>
                  <TextField
                    label="Enter your prompt"
                    multiline
                    rows={3}
                    onChange={handleTextOnChange}
                  />
                </StackItem>
                <StackItem>
                  <PrimaryButton text="Submit" onClick={handleQueAndAns} />
                </StackItem>
              </Stack>
            </StackItem>

            <StackItem>
              <AceEditor
                mode="python"
                theme="github"
                readOnly={true}
                name="Result"
                editorProps={{ $blockScrolling: true }}
                value={outputResult}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
              ></AceEditor>
            </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </>
  );
}

export default Development;
