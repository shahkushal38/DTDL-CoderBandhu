import React, { useCallback, useContext, useRef, useState } from "react";
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
import TestingContext from "../../context/Testing/testingContext";

export function Testing() {
  const [value, setValue] = useState("");
  const [isDisable, setIsDisable] = useState(false);
  const aceEditor = useRef();

  function handleOnChange(newValue) {
    setValue(newValue);
  }

  const { testcases, getTestcases } = useContext(TestingContext);

  const handleGenerateTest = useCallback(() => {
    if (value != null && value.length > 0) {
      setIsDisable(true);
      console.log("Value -- ", value);
      const inputObject = {
        prompt:
          "Enhance the variable namings of the following code as per the business logic",
        code: value,
      };

      getTestcases(inputObject).then(() => {
        setIsDisable(false);
      });
    }
  }, [value, getTestcases]);

  function renderSpinner() {
    if (isDisable) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }
  return (
    <Stack verticalFill>
      <StackItem>
        <h1 className="phase_heading">Testing Phase </h1>
      </StackItem>

      <StackItem>
        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <StackItem>
            <AceEditor
              ref={aceEditor}
              mode="python"
              theme="monokai"
              onChange={handleOnChange}
              name="Development"
              editorProps={{ $blockScrolling: true }}
              debounceChangePeriod={3}
              style={{ margin: 16, width: "40vw" }}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            ></AceEditor>

            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <StackItem>
                {/* <PrimaryButton
                  text="Generate Test Cases"
                  onClick={handleGenerateTest}
                  styles={{ root: { margin: 16 } }}
                  disabled={isDisable}
                /> */}
                <button
                  disabled={isDisable}
                  onClick={handleGenerateTest}
                  className="dev_button1"
                >
                  Generate Test Cases
                </button>
              </StackItem>
              <StackItem>{renderSpinner()}</StackItem>
            </Stack>
          </StackItem>

          <StackItem>
            <AceEditor
              mode="python"
              theme="github"
              readOnly={true}
              name="Test Result"
              editorProps={{ $blockScrolling: true }}
              value={testcases}
              style={{ margin: 16, width: "40vw" }}
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
  );
}

export default Testing;
