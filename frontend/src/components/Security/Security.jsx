import React, { useContext, useState } from "react";
import SecurityContext from "../../context/Security/securityContext";

var init = {
  codeInput: "",
};

function Security() {
  const { vulnerabilityReport, getVulnerabilityReport } =
    useContext(SecurityContext);

  const [formData, setFormData] = useState(init);
  const [loading, setLoading] = useState(false);

  const canSubmit = formData.codeInput != "";

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await getVulnerabilityReport(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Security</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="codeInput"
          value={formData.codeInput}
          onChange={handleChange}
          rows={25}
          cols={80}
        ></textarea>
        <button
          disabled={!canSubmit}
        >
          submit
        </button>
      </form>
      {loading
        ? "Loading"
        : vulnerabilityReport.length > 0 && (
          <div>
            <h3>Total Vulnerabilities : {vulnerabilityReport?.length}</h3>
            {vulnerabilityReport?.map((item, key) => (
              <div key={key}>
                <span>
                  <b>Name : </b> {item?.name}
                </span>
                <br />
                <span>
                  <b>Line Number : </b> {item?.line_number}
                </span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default Security;
