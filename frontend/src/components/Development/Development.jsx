import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AceEditor from "react-ace";
import {
  PrimaryButton,
  Spinner,
  Stack,
  StackItem,
  TextField,
} from "@fluentui/react";
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
  const [isDisableVariable, setIsDisable] = useState(false);
  const [isDisableGenerate, setIsDisableGenerate] = useState(false);
  const [isDisableSelection, setIsDisableSelection] = useState(false);
  const [isDisableSubmit, setIsDisableSubmit] = useState(false);

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
      setIsDisable(true);
      const inputObject = {
        prompt:
          "Enhance the variable namings of the following code as per the business logic",
        code: value,
      };

      getDevelopmentCode(inputObject).then(() => {
        setIsDisable(false);
      });
    }
  }, [value, getDevelopmentCode]);

  const handleGenerateCode = useCallback(() => {
    if (value != null && value.length > 0) {
      setIsDisableGenerate(true);
      const inputObject = {
        prompt: value,
      };

      getCodeFromComments(inputObject).then(() => {
        setIsDisableGenerate(false);
      });
    }
  }, [value, getCodeFromComments]);

  const handleQueAndAns = useCallback(() => {
    if (value != null && value.length > 0) {
      setIsDisableSubmit(true);
      console.log("Value -- ", value);
      const inputObject = {
        prompt: userPrompt,
        code: value,
      };

      getQueAndAns(inputObject).then(() => {
        setIsDisableSubmit(false);
      });
    }
  }, [getQueAndAns, value]);

  const handleSelectedCode = useCallback(() => {
    if (value != null && value.length > 0) {
      setIsDisableSelection(true);
      console.log("Value selected in -- ", value);
      const inputObject = {
        prompt: "Explain the following piece of code",
        code: value,
      };

      getQueAndAns(inputObject).then(() => {
        setIsDisableSelection(false);
      });
    }
  }, [getQueAndAns, value]);

  function renderSpinner1() {
    if (isDisableVariable) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }

  function renderSpinner2() {
    if (isDisableGenerate) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }
  function renderSpinner3() {
    if (isDisableSelection) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }
  function renderSpinner4() {
    if (isDisableSubmit) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }

  return (
    <>
      <Stack verticalFill>
        <StackItem>
          <h1 className="phase_heading">Development Phase </h1>
        </StackItem>

        <StackItem>
          <Stack horizontal tokens={{ childrenGap: 16 }}>
            <StackItem>
              <h3 style={{ paddingLeft: "20px" }}>Enter code here:</h3>
              <AceEditor
                ref={aceEditor}
                mode="python"
                theme="monokai"
                onSelectionChange={handleOnSelectionChange}
                style={{ margin: 16, width: "40vw" }}
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
                  {/* <PrimaryButton
                    text="Improve Variable Naming"
                    onClick={handleVariablesClick}
                    disabled={isDisableVariable}
                    styles={{ root: { margin: 16 } }}
                  /> */}
                  <button
                    disabled={isDisableVariable}
                    onClick={handleVariablesClick}
                    className="dev_button1"
                  >
                    Improve Variable Naming
                  </button>
                </StackItem>
                <StackItem>{renderSpinner1()}</StackItem>
                <StackItem>
                  {/* <PrimaryButton
                    text="Generate code"
                    onClick={handleGenerateCode}
                    disabled={isDisableGenerate}
                    styles={{ root: { margin: 16 } }}
                  /> */}
                  <button
                    onClick={handleGenerateCode}
                    disabled={isDisableGenerate}
                    className="dev_button2"
                  >
                    Generate code
                  </button>
                </StackItem>
                <StackItem>{renderSpinner2()}</StackItem>
                <StackItem>
                  {/* <PrimaryButton
                    text="Understand Selected code"
                    onClick={handleSelectedCode}
                    disabled={isDisableSelection}
                    styles={{ root: { margin: 16 } }}
                  /> */}
                  <button
                    onClick={handleSelectedCode}
                    disabled={isDisableSelection}
                    className="dev_button3"
                  >
                    Understand Selected code
                  </button>
                </StackItem>
                <StackItem>{renderSpinner3()}</StackItem>
              </Stack>

              <Stack verticalFill>
                <StackItem>
                  {/* <TextField
                    styles={{
                      root: { margin: 16 },
                      wrapper: { color: "white" },
                    }}
                    label="Enter your prompt"
                    multiline
                    rows={3}
                    onChange={handleTextOnChange}
                  /> */}
                  <h3 style={{ paddingLeft: "20px" }}>Enter your prompt:</h3>
                  <textarea
                    name="prompt"
                    id=""
                    rows={3}
                    cols={20}
                    multiline
                    onChange={handleTextOnChange}
                    className="dev_textarea"
                  ></textarea>
                </StackItem>
                <StackItem>
                  {/* <PrimaryButton
                    text="Submit"
                    onClick={handleQueAndAns}
                    disabled={isDisableSubmit}
                    styles={{ root: { margin: 16 } }}
                  /> */}
                  <button onClick={handleQueAndAns}
                    disabled={isDisableSubmit} className="dev_button1">Submit</button>
                </StackItem>
                <StackItem>{renderSpinner4()}</StackItem>
              </Stack>
            </StackItem>

            <StackItem>
              <h3 style={{ paddingLeft: "20px" }}>Result generated by AI:</h3>
              <AceEditor
                mode="python"
                theme="github"
                readOnly={true}
                style={{ margin: 16, width: "40vw" }}
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
