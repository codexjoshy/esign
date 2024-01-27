import React, { useRef, useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { Resizable } from 'react-resizable';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// import './Sample.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//  'pdfjs-dist/build/pdf.worker.min.js',
//  import.meta.url,
// ).toString();

const options = {
 cMapUrl: '/cmaps/',
 standardFontDataUrl: '/standard_fonts/',
};

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PdfViewerProps { }

const PdfViewer: React.FC<PdfViewerProps> = () => {
 const pdfContainerRef = useRef<HTMLDivElement>(null);
 const [pagesInfo, setPagesInfo] = useState<{ top: number; bottom: number; }[]>([]);
 const [draggedElement, setDraggedElement] = useState<HTMLDivElement | null>(null);
 const [scale, setScale] = useState(1);
 const [position, setPosition] = useState({ x: 0, y: 0 });
 const [isDragging, setIsDragging] = useState(false);
 const [dropIndicatorPosition, setDropIndicatorPosition] = useState<{ x: number; y: number } | null>(null);

 const [numPages, setNumPages] = useState<number | null>(null);

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
 const [, dragRef, preview] = useDrag({
  type: 'draggable',
  item: { type: 'draggable' },
  collect: (monitor) => ({
   isDragging: monitor.isDragging(),
  }),
 });

 // Attach preview image for dragged element
 if (typeof Image !== 'undefined') {
  preview(getEmptyImage(), { captureDraggingState: true });
 }

 const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  // Handle dropped files (PDF, images, etc.)
  const dropX = event.clientX - pdfContainerRef.current!.offsetLeft;
  const dropY = event.clientY - pdfContainerRef.current!.offsetTop;
  setDropIndicatorPosition({ x: dropX, y: dropY });
 };

 const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  event.preventDefault();
 };

 // Handle drag start
 const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
  setDraggedElement(event.target as HTMLDivElement);
  setIsDragging(true);
 };

 // Handle drag end
 const handleDragEnd = () => {
  setDraggedElement(null);
  setIsDragging(false);
  setDropIndicatorPosition(null);
 };

 // Calculate page positions when the component mounts
 useEffect(() => {
  if (window.document) {
   calculatePagePositions();
   window.addEventListener('resize', calculatePagePositions);
   return () => {
    window.removeEventListener('resize', calculatePagePositions);
   };

  }
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

 // Zoom in
 const zoomIn = () => {
  setScale(scale + 0.1);
 };

 // Zoom out
 const zoomOut = () => {
  setScale(scale - 0.1);
 };

 // Reset zoom
 const resetZoom = () => {
  setScale(1);
 };

 // Pan functionality
 const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  const startScrollLeft = pdfContainerRef.current!.scrollLeft;
  const startScrollTop = pdfContainerRef.current!.scrollTop;

  const handleMouseMove = (event: MouseEvent) => {
   const dx = event.clientX - startX;
   const dy = event.clientY - startY;
   pdfContainerRef.current!.scrollLeft = startScrollLeft - dx;
   pdfContainerRef.current!.scrollTop = startScrollTop - dy;
  };

  const handleMouseUp = () => {
   window.removeEventListener('mousemove', handleMouseMove);
   window.removeEventListener('mouseup', handleMouseUp);
   setIsDragging(false);
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
 };

 const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
  setNumPages(numPages);
 };

 return (
  // <div
  //  ref={pdfContainerRef}
  //  onDrop={handleDrop}
  //  onDragOver={handleDragOver}
  //  style={{
  //   width: '100%',
  //   height: '100%',
  //   overflow: 'auto',
  //   transform: `scale(${scale})`,
  //   transformOrigin: 'top left',
  //   position: 'relative', // Required for the drop indicator
  //  }}
  //  onMouseDown={handleMouseDown}
  // >
  <>
   {/* Drop indicator */}
   {dropIndicatorPosition && (
    <div
     style={{
      position: 'absolute',
      left: dropIndicatorPosition.x,
      top: dropIndicatorPosition.y,
      width: '50px',
      height: '50px',
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      border: '2px solid blue',
     }}
    />
   )}
   <Document file="/sample.pdf" onLoadSuccess={handleDocumentLoadSuccess} options={options}>
    {Array.from(new Array(numPages || 0), (_, index) => (
     <Page key={index + 1} pageNumber={index + 1} width={800}>
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
   {/* Zoom controls */}
   <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 9999 }}>
    <button onClick={zoomIn}>Zoom In</button>
    <button onClick={zoomOut}>Zoom Out</button>
    <button onClick={resetZoom}>Reset Zoom</button>
   </div>

  </>
  // </div>
 );
};

export default PdfViewer;
