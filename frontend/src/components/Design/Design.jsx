import React, { useEffect, useState } from 'react'
import "./Design.css";
import Mermaid from './Mermaid';


const text = `
    graph LR
    subgraph "User Interface [User Interface]"
        User[User interacts] --> Presentation_Layer
    end
    subgraph "Presentation Layer [Presentation Layer]"
        Presentation_Layer --> Business_Logic_Layer[Prepares data for display]
    end
    subgraph "Business Logic Layer [Business Logic Layer]"
        Business_Logic_Layer --> Data_Access_Layer[Business Logic Requests]
    end
    subgraph "Data Access Layer [Data Access Layer]"
        Data_Access_Layer --> Database[Accesses data or performs actions]
    end
    subgraph "Database [Database]"
        Database --> Data_Access_Layer[Fetches or updates data]
    end

`;

function Design() {
    const [mermaidText, setMermaidText] = useState("");
    const updateDiagram = (text_input) => {
        setMermaidText(text_input);
    }
    useEffect(() => {
        updateDiagram(text);
    });
    return (
        <div style={{ height: "80vh", width: "80vw" }}>
            <Mermaid chart={mermaidText} />
        </div>
    )
}

export default Design