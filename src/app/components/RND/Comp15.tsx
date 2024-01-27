'use client'
import React, { useRef, useState, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps { }

const PdfViewer: React.FC<PdfViewerProps> = () => {
 const pdfContainerRef = useRef<HTMLDivElement>(null);
 const [pagesInfo, setPagesInfo] = useState<{ top: number; bottom: number; }[]>([]);
 const [draggedElement, setDraggedElement] = useState<HTMLDivElement | null>(null);

 // Calculate position of each page within the viewport
 const calculatePagePositions = () => {
  const pageElements = pdfContainerRef.current!.querySelectorAll('.react-pdf__Page');
  const pagePositions = Array.from(pageElements).map((pageElement) => {
   const rect = (pageElement as HTMLElement).getBoundingClientRect();
   return {
    top: rect.top,
    bottom: rect.bottom,
   };
  });
  setPagesInfo(pagePositions);
 };

 // Drag and drop functionality
 const [{ isDragging }, dragRef, preview] = useDrag({
  type: 'draggable',
  item: { type: 'draggable' },
  collect: (monitor) => ({
   isDragging: monitor.isDragging(),
  }),
 });

 // Attach preview image for dragged element
 // preview(getEmptyImage(), { captureDraggingState: true });

 const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  // Handle dropped files (PDF, images, etc.)
 };

 const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
 };

 // Handle drag start
 const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
  setDraggedElement(event.target as HTMLDivElement);
 };

 // Handle drag end
 const handleDragEnd = () => {
  setDraggedElement(null);
 };

 // Calculate page positions when the component mounts
 useEffect(() => {
  calculatePagePositions();
  window.addEventListener('resize', calculatePagePositions);
  return () => {
   window.removeEventListener('resize', calculatePagePositions);
  };
 }, []);

 // Determine the page the dragged element is on
 const determineDraggedPage = (dragY: number) => {
  let draggedPage = -1;
  pagesInfo.forEach((page, index) => {
   if (dragY >= page.top && dragY <= page.bottom) {
    draggedPage = index + 1;
   }
  });
  return draggedPage;
 };

 return (
  <div
   ref={pdfContainerRef}
   onDrop={handleDrop}
   onDragOver={handleDragOver}
   style={{ width: '100%', height: '100%', overflow: 'auto' }}
  >
   <Document file="/sample.pdf">
    {Array.from({ length: 5 }).map((_, index) => (
     <Page key={index + 1} pageNumber={index + 1}>
      {/* Drag handle for each page */}
      <div
       ref={dragRef}
       onDragStart={handleDragStart}
       onDragEnd={handleDragEnd}
       draggable
       style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: isDragging && draggedElement === pdfContainerRef.current ? 0.5 : 1,
        pointerEvents: isDragging && draggedElement === pdfContainerRef.current ? 'none' : 'auto',
       }}
      />
     </Page>
    ))}
   </Document>
  </div>
 );
};

function MainContent() {
 return (
  <PdfViewer />
 )
}

// Comp13 component
const Comp15: React.FC = () => {
 return (
  <div className="w-full min-h-[100vh] flex bg-blue-50">
   <div className="w-[20%] min-h-[100vh] bg-purple-600">
    {/* <Sidebar /> */}
   </div>
   <div className="w-[100%] h-[100vh] overflow-scroll">
    <MainContent />
   </div>
  </div>
 );
};

export default Comp15
