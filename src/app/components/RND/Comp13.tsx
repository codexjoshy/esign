'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';
import useDocumentModifier from '../useDocumentModifier';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// DraggableText component
interface DraggableTextProps {
 text: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({ text }) => {
 const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
  e.dataTransfer.setData('text', text);
 };

 return (
  <div draggable onDragStart={onDragStart}>
   {text}
  </div>
 );
};

// MainContent component
const MainContent: React.FC = () => {
 const pdfUrl = '/sample.pdf'; // Replace this with the URL of your PDF file
 const [numPages, setNumPages] = useState<number | null>(null);
 const [firstPageHeight, setFirstPageHeight] = useState<number | null>(null);
 const { getPdfDimension } = useDocumentModifier({ pdfUrl });
 const pdfContainerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  const loadFirstPage = () => {
   try {
    const dimensions = getPdfDimension();
    if (dimensions) {
     console.log({ dimensions })
     setFirstPageHeight(dimensions.height);
    }
   } catch (error) {
    console.error('Error loading PDF dimensions:', error);
   }
  };

  loadFirstPage();
 }, [pdfUrl]);

 const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
  setNumPages(numPages);
 };

 const [droppedItems, setDroppedItems] = useState<{ text: string; x: number; y: number; pageNumber: number }[]>([]);

 const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text');
  const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
  const y = e.clientY - e.currentTarget.getBoundingClientRect().top;

  const pageNumber = Math.ceil(y / (firstPageHeight || 1));

  setDroppedItems([...droppedItems, { text, x, y, pageNumber }]);
 };

 const getPageIndexForItem = (item: { x: number; y: number }) => {
  const rect = pdfContainerRef.current?.getBoundingClientRect();
  if (!rect || !firstPageHeight) return 0;

  const relativeY = item.y - rect.top;
  const pageIndex = Math.floor(relativeY / (firstPageHeight || 1));
  console.log({ pageIndex });

  return pageIndex;
 };

 const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
 };

 const handleDownload = async () => {
  // Download modified PDF
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  for (const item of droppedItems) {
   const pageIdx = getPageIndexForItem(item,);
   const page = pdfDoc.getPage(pageIdx);
   const textSize = 10; // Adjust text size as needed
   const pageHeight = page.getHeight();
   page.drawText(item.text, { x: item.x, y: pageHeight - item.y - textSize, size: textSize });
  }

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modified_pdf.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
 };

 const captureLayout = async () => {
  alert(firstPageHeight)
  if (pdfContainerRef.current && firstPageHeight && numPages) {
   const canvas = await html2canvas(pdfContainerRef.current);
   const pdf = new jsPDF();
   pdf.addImage(canvas.toDataURL('image/png'), 0, 0, 900, (firstPageHeight * numPages));
   pdf.save('modified_layout.pdf');
  }
 };

 return (
  <div className="w-full" onDrop={onDrop} onDragOver={onDragOver}>
   <h2>PDF Viewer</h2>
   <div className='w-full flex gap-3'>
    <button className="p-2 bg-blue-600" onClick={handleDownload}>
     Download Modified PDF
    </button>
    <button className="p-2 bg-purple-600" onClick={captureLayout}>
     Capture PDF
    </button>

   </div>

   <div className="w-full relative" style={{ minHeight: '500px' }} ref={pdfContainerRef}>
    <Document file={pdfUrl} onLoadSuccess={handleDocumentLoadSuccess}>
     {Array.from(new Array(numPages || 0), (_, index) => (
      <Page key={index + 1} pageNumber={index + 1} width={800} />
     ))}
     {droppedItems.map((item, index) => (
      <Rnd
       key={index}
       style={{
        position: 'absolute',
        top: item.y,
        left: item.x,
        border: '1px solid #ccc',
        background: 'purple',
        textAlign: 'center',
        padding: '8px',
        cursor: 'move',
        color: 'white',
       }}
       position={{ x: item.x, y: item.y }}
       size={{ width: 180, height: 40 }}
      >
       {item.text}
      </Rnd>
     ))}
    </Document>
   </div>
  </div>
 );
};

// Sidebar component
const Sidebar: React.FC = () => {
 const menus = ['Signature', 'Initials', 'Date Signed', 'Name Prefix', 'Name', 'Phone', 'Email', 'Text'];

 return (
  <div className="w-full h-full p-9">
   <div className="w-full h-12  relative">
    {menus.map((menu, index) => (
     <DraggableText key={index} text={menu} />
    ))}
   </div>
  </div>
 );
};

// Comp13 component
const Comp13: React.FC = () => {
 return (
  <div className="w-full min-h-[100vh] flex bg-blue-50">
   <div className="w-[20%] min-h-[100vh] bg-purple-600">
    <Sidebar />
   </div>
   <div className="w-[100%] h-[100vh] overflow-scroll">
    <MainContent />
   </div>
  </div>
 );
};

export default Comp13;
