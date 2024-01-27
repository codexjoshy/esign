import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface TextSelectionProps {
 pageNumber: number;
}

const TextSelection: React.FC<TextSelectionProps> = ({ pageNumber }) => {
 const [selectedText, setSelectedText] = useState('');

 // Function to handle text selection
 const handleTextSelection = () => {
  // Logic to retrieve selected text from the PDF viewer
  // Set selected text to state
 };

 return (
  <div>
   {/* Render PDF page */}
   <Page pageNumber={pageNumber} />

   {/* Render selected text */}
   {selectedText && (
    <div>
     Selected Text: {selectedText}
    </div>
   )}
  </div>
 );
};

export default TextSelection;
