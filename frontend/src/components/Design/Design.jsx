import React, { useContext, useEffect, useState } from 'react'
import "./Design.css";
import Mermaid from './Mermaid';
import DesignContext from '../../context/DesignContext/designContext';

function Design() {
    const { mermaidData, getMermaidData } = useContext(DesignContext);

    useEffect(() => {
    }, []);

    const handleSubmit = () => {
        getMermaidData("Generate mermaid js flowchat code for 'libary management system");
    }
    return (
        <div style={{ height: "100vh", width: "85%" }}>
            <button onClick={() => handleSubmit()}>Submit</button>
            <div>
                <Mermaid chart={mermaidData} />
            </div>
        </div>
    )
}

export default Design