import React, { useCallback, useContext, useMemo, useState } from "react";
import SecurityContext from "../../context/Security/securityContext";
import {
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  Stack,
  StackItem,
} from "@fluentui/react";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import SecurityCharts from "./SecurityCharts";

function Security() {
  const [formData, setFormData] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const [isError, setIsError] = useState(false);
  const { vulnerabilityReport, getVulnerabilityReport } =
    useContext(SecurityContext);

  function handleOnChange(newValue) {
    setFormData(newValue);
  }

  const handleGenerateSecurityReport = useCallback(() => {
    if (formData != null && formData.length > 0) {
      setIsDisable(true);
      console.log("Value in security -- ", formData);
      const inputObject = {
        codeInput: formData,
      };

      getVulnerabilityReport(inputObject)
        .then(() => {
          console.log("In then");

          setIsDisable(false);
        })
        .catch((err) => {
          setIsError(true);
        });
    }
  }, [getVulnerabilityReport, formData]);

  const axes = useMemo(() => {
    const vulnerability = new Map();
    if (vulnerabilityReport) {
      vulnerabilityReport.forEach((option) => {
        if (vulnerability.has(option.name)) {
          vulnerability.set(option.name, [
            ...vulnerability.get(option.name),
            option.line_number,
          ]);
        } else {
          vulnerability.set(option.name, [option.line_number]);
        }
      });
    }

    return vulnerability;
  }, [vulnerabilityReport]);

  console.log("Vulnerability - ", axes);

  function renderMessageBar() {
    if (isError) {
      return (
        <MessageBar
          title="Something went wrong"
          messageBarType={MessageBarType.error}
        />
      );
    }
    return null;
  }

  function renderSpinner() {
    if (isDisable) {
      console.log("In spinner");
      return <Spinner styles={{ root: { paddingTop: 22, marginLeft: -8 } }} />;
    }
  }

  return (
    <Stack verticallFill>
      <StackItem>
        <h1 className="phase_heading">Security Phase </h1>
      </StackItem>

      <StackItem>
        <Stack horizontal>
          <StackItem>
            <Stack verticalFill>
              <StackItem>
                <AceEditor
                  mode="python"
                  theme="monokai"
                  onChange={handleOnChange}
                  name="Security"
                  editorProps={{ $blockScrolling: true }}
                  style={{ margin: 16 }}
                  debounceChangePeriod={3}
                  setOptions={{
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    enableSnippets: true,
                  }}
                />
              </StackItem>

              <Stack horizontal>
                <StackItem>
                  <PrimaryButton
                    text={"Submit"}
                    disabled={isDisable}
                    onClick={handleGenerateSecurityReport}
                    styles={{ root: { margin: 16 } }}
                  />
                </StackItem>
                <StackItem>{renderSpinner()}</StackItem>
              </Stack>

              <StackItem>{renderMessageBar()}</StackItem>
            </Stack>
          </StackItem>

          {vulnerabilityReport.length > 0 && (
            <StackItem>
              <SecurityCharts vulnerabilityReport={vulnerabilityReport} />
            </StackItem>
          )}
        </Stack>
      </StackItem>
    </Stack>
  );
}
export default Security;
