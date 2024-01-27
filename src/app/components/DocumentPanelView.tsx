'use client';

import { useCallback, useState } from 'react';
import { useResizeObserver } from '@wojtekmaj/react-hooks';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import './Sample.css';

import type { PDFDocumentProxy } from 'pdfjs-dist';
// import useDocumentModifier from './useDocumentModifier';
import React from 'react';
import { useDragDropManager, useDrop } from 'react-dnd';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//  'pdfjs-dist/build/pdf.worker.min.js',
//  import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const options = {
 cMapUrl: '/cmaps/',
 standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

export default function DocumentPanelView() {
 const [file, setFile] = useState<PDFFile>('http://localhost:3000/sample.pdf');
 const [numPages, setNumPages] = useState<number>();
 const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
 const [containerWidth, setContainerWidth] = useState<number>();
 const onResize = useCallback<ResizeObserverCallback>((entries) => {
  const [entry] = entries;

  if (entry) {
   setContainerWidth(entry.contentRect.width);
  }
 }, []);

 useResizeObserver(containerRef, resizeObserverOptions, onResize);

 function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
  const { files } = event.target;

  if (files && files[0]) {
   setFile(files[0] || null);
  }
 }

 const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
  setNumPages(numPages);
 };

 // const { downloadPDF, setPageOptions } = useDocumentModifier({ pdfUrl: file as string })
 const handleDownload = async () => {
  // await downloadPDF();
 }

 const [{ isOver }, drop] = useDrop(() => ({
  accept: 'Drag',
  // drop: (item) => handleDrop(item),
  drop(item, monitor) {
   const offset = monitor.getSourceClientOffset();
   console.log({ offset });


  },
  collect: (monitor) => ({
   isOver: monitor.isOver()
  })
 }))

 const handleDrop = (item: any) => {
  console.log({ item });

 }
 return (
  <div className="Example h-full">
   {/* <header>
    <h1>react-pdf sample page</h1>
   </header> */}
   <div className="Example__container">
    <div className="Example__container__load">
     <label htmlFor="file">Load from file:</label>{' '}
     <input onChange={onFileChange} type="file" />

     <button onClick={handleDownload} className='p-2 bg-violet-400 rounded-md font-semibold'>Download</button>
    </div>
    <div className="Example__container__document" ref={setContainerRef}>
     <div ref={drop} className='w-full h-full'>
      <Document className="Example__container__document" file={file} onLoadSuccess={handleDocumentLoadSuccess} options={options}>
       {Array.from(new Array(numPages), (el, index) => (
        <Page
         className="relative"
         key={`page_${index + 1}`}
         pageNumber={index + 1}
         width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
        >
        </Page>

       ))}

      </Document>

     </div>
    </div>
   </div>
  </div>
 );
}

function Todo() {
 // TODO: get the position of where items are
 // draw the item with pdf lib
 // save the item with pdf lib
}