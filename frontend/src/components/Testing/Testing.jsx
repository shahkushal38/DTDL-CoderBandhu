import React, { useCallback, useContext, useRef, useState } from "react";
import AceEditor from "react-ace";
import { PrimaryButton, Stack, StackItem, TextField } from "@fluentui/react";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import DevelopmentContext from "../../context/Development/developmentContext";

export function Testing() {
  const [value, setValue] = useState("");
  const aceEditor = useRef();

  function handleOnChange(newValue) {
    setValue(newValue);
  }

  const { getDevelopmentCode, outputCode } = useContext(DevelopmentContext);

  const handleGenerateTest = useCallback(() => {
    if (value != null && value.length > 0) {
      console.log("Value -- ", value);
      const inputObject = {
        prompt:
          "Enhance the variable namings of the following code as per the business logic",
        code: value,
      };

      getDevelopmentCode(inputObject);
    }
  }, [value, getDevelopmentCode]);

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
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            ></AceEditor>

            <Stack horizontal tokens={{ childrenGap: 16 }}>
              <StackItem>
                <PrimaryButton
                  text="Generate Test Cases"
                  onClick={handleGenerateTest}
                />
              </StackItem>
            </Stack>
          </StackItem>

          <StackItem>
            <AceEditor
              mode="python"
              theme="github"
              readOnly={true}
              name="Test Result"
              editorProps={{ $blockScrolling: true }}
              value={outputCode}
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
