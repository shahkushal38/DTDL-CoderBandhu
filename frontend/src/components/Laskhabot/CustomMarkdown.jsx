import React, { useState, useEffect, useRef, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { usePDF } from "react-to-pdf";
import remarkGfm from "remark-gfm";
import "./Markdown.css";
import LakshaBotContext from "../../context/LakshaBot/lakshaBotContext";

const MarkdownToPdf = () => {
  const { markdownFile } = useContext(LakshaBotContext);

  useEffect(() => {
    if (markdownFile) toPDF();
  }, [markdownFile]);

  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  return (
    <div className="markdown_container">
      <div
        ref={targetRef}
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          padding: 20,
          color: "black",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdownFile}
        </ReactMarkdown>
      </div>
      {/* <button onClick={() => toPDF()}>Download as PDF</button> */}
    </div>
  );
};

export default MarkdownToPdf;
