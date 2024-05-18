import React, { useCallback, useContext, useState } from "react";
import AceEditor from "react-ace";
import { PrimaryButton, Stack, StackItem } from "@fluentui/react";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import DevelopmentContext from "../../context/Development/developmentContext";

export function Development() {
  const [value, setValue] = useState("");
  function handleOnChange(newValue) {
    console.log("seleccted Text - ", newValue);
    setValue(newValue);
  }

  const { getDevelopmentCode, outputCode } = useContext(DevelopmentContext);

  const handleVariablesClick = useCallback(() => {
    if (value != null && value.length > 0) {
      console.log("Value -- ", value);
      const inputObject = {
        prompt:
          "Enhance the varaible namings of the following code as per the business logic",
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
                mode="java"
                theme="monokai"
                onChange={handleOnChange}
                name="Development"
                editorProps={{ $blockScrolling: true }}
                value={value}
                setOptions={{
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  enableSnippets: true,
                }}
              ></AceEditor>

              <PrimaryButton
                text="Improve Variable Naming"
                onClick={handleVariablesClick}
              />
            </StackItem>
            <StackItem>
              <AceEditor
                mode="java"
                theme="monokai"
                // onChange={handleOnChange}
                name="Result"
                editorProps={{ $blockScrolling: true }}
                // value={value}
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
