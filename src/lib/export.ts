"use client";

import { marked } from "marked";
import { asBlob } from "html-docx-js-typescript";
import { saveAs } from "file-saver";

export async function exportToDocx(markdownContent: string, fileName: string) {
  if (!markdownContent) return;
  
  try {
    // 1. Convert markdown to HTML
    const htmlContent = await marked.parse(markdownContent);
    
    // 2. Wrap the HTML in a basic document structure required by DOCX converters
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${fileName}</title>
        </head>
        <body style="color: #000000; font-family: Arial, sans-serif; font-size: 11pt;">
          ${htmlContent}
        </body>
      </html>
    `;
    
    // 3. Convert the HTML string into a Word Document Blob
    const blob = await asBlob(fullHtml, { orientation: "portrait", margins: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }); // 1440 twips = 1 inch
    
    // 4. Trigger the browser download
    saveAs(blob as Blob, `${fileName}.docx`);
  } catch (error) {
    console.error("Failed to export to DOCX:", error);
    alert("Failed to export document. Please try copying it instead.");
  }
}
