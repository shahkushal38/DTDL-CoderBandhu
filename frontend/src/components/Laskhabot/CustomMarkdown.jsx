import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePDF } from 'react-to-pdf';
import remarkGfm from "remark-gfm";
import "./Markdown.css"

const MarkdownToPdf = () => {
    const [markdown, setMarkdown] = useState('');

    useEffect(() => {
        // Fetch the Markdown file
        fetch('/trial.md')
            .then(response => response.text())
            .then(text => setMarkdown(text));
    }, []);


    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    return (
        <div>
            <div ref={targetRef} style={{ position: 'absolute', top: '-9999px', left: '-9999px', padding: 20, color: "black" }}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
            <button onClick={() => toPDF()}>Download as PDF</button>
        </div>
    );
};

export default MarkdownToPdf;
