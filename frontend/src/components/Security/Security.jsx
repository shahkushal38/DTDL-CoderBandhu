import React, { useCallback, useContext, useState } from "react";
import SecurityContext from "../../context/Security/securityContext";
import { PrimaryButton, Stack, StackItem } from "@fluentui/react";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

function Security() {
  const [formData, setFormData] = useState();

  const { vulnerabilityReport, getVulnerabilityReport } =
    useContext(SecurityContext);

  function handleOnChange(newValue) {
    setFormData(newValue);
  }

  const handleGenerateSecurityReport = useCallback(() => {
    if (formData != null && formData.length > 0) {
      console.log("Value in security -- ", formData);
      const inputObject = {
        codeInput: formData,
      };

      getVulnerabilityReport(inputObject);
    }
  }, [getVulnerabilityReport, formData]);

  console.log("Vulnerability - ", vulnerabilityReport);

  return (
    <Stack verticallFill>
      <StackItem>
        <h1 className="phase_heading">Security Phase </h1>
      </StackItem>

      <StackItem>
        <Stack verticalFill>
          <StackItem>
            <AceEditor
              mode="python"
              theme="monokai"
              onChange={handleOnChange}
              name="Security"
              editorProps={{ $blockScrolling: true }}
              debounceChangePeriod={3}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
              }}
            />
          </StackItem>

          <StackItem>
            <PrimaryButton
              text={"Submit"}
              onClick={handleGenerateSecurityReport}
            />
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
}
export default Security;
