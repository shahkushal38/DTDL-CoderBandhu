import React, { useContext, useEffect, useState } from "react";
import "./Design.css";
import Mermaid from "./Mermaid";
import DesignContext from "../../context/DesignContext/designContext";
import { chartTypes } from "../../utils/design";

var init = {
  chartType: "",
  chartInput: "",
};

function Design() {
  const { mermaidData, getMermaidData } = useContext(DesignContext);
  const [formData, setFormData] = useState(init);
  const [loading, setLoading] = useState(false);

  useEffect(() => { }, []);

  const canSubmit = formData.chartInput != "" && formData.chartType != "";

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      setLoading(true);
      await getMermaidData(formData);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="design_container">
      <h1 className="phase_heading">Design</h1>
      <form onSubmit={handleSubmit} className="design_phase_form">
        <div className="design_input">
          <input
            name="chartInput"
            onChange={handleChange}
            required
            placeholder="Give short desciption"
            className="design_desc"
          />
          <select
            name="chartType"
            onChange={handleChange}
            required
            placeholder="Select type of diagram"
            className="design_select"
          >
            <option value="" disabled selected>
              Select diagram type
            </option>
            {chartTypes?.map((item, key) => (
              <option key={key} value={item.val}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="design_submit_button"
        >
          Submit
        </button>
      </form>
      <div>
        {loading ? "Loading" : mermaidData && <Mermaid chart={mermaidData} />}
      </div>
    </div>
  );
}

export default Design;
