import React, { useCallback, useContext, useRef, useState } from "react";
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

  function handleOnSelectionChange(selectedValue, _) {
    const newValue = aceEditor.current.editor.getSelectedText();
    setValue(newValue);
  }

  const { getDevelopmentCode, outputCode } = useContext(DevelopmentContext);

  const handleVariablesClick = useCallback(() => {
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

  const handleGenerateCode = useCallback(() => {
    if (value != null && value.length > 0) {
      console.log("Value -- ", value);
      const inputObject = {
        prompt: "Generate the code for given text- ",
        code: value,
      };

      getDevelopmentCode(inputObject);
    }
  }, [value, getDevelopmentCode]);

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
                    onClick={handleGenerateCode}
                  />
                </StackItem>
              </Stack>

              <Stack verticalFill>

                <StackItem>
                  <TextField label="Enter your prompt" multiline rows={3} />
                </StackItem>
                <StackItem>
                  <PrimaryButton text="Submit" />
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
    </>
  );
}

export default Development;
