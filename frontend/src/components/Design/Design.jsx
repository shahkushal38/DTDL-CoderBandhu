import React, { useContext, useEffect, useState } from 'react'
import "./Design.css";
import Mermaid from './Mermaid';
import DesignContext from '../../context/DesignContext/designContext';


var init = {
    chartType: "",
    chartInput: ""
}
function Design() {
    const { mermaidData, getMermaidData } = useContext(DesignContext);
    const [formData, setFormData] = useState(init);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, []);

    const canSubmit = formData.chartInput != "" && formData.chartType != "";

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await getMermaidData(formData);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div style={{ height: "100vh", width: "85%" }}>
            <h1>Design</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input name="chartInput" onChange={handleChange} required />
                    <select name="chartType" onChange={handleChange} required>
                        <option value="" hidden defaultChecked></option>
                        <option value="Flowchart">FlowChart</option>
                        <option value="Use Case Diagram">Use Case Diagram</option>
                        <option value="Sequence Diagram">Sequence Diagram</option>
                        <option value="Architecture Diagram">Architecture Diagram</option>
                    </select>
                </div>
                <button type="submit" disabled={!canSubmit}>Submit</button>
            </form>
            <div>
                {loading ? "Loading" : <Mermaid chart={mermaidData} />}
            </div>
        </div>
    )
}

export default Design