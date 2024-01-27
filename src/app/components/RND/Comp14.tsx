import React, { useRef, useEffect, useState } from 'react';
import pdfjs, { PDFDocumentProxy } from 'pdfjs-dist';

interface PdfViewerProps {
  pdfUrl: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  console.log({ pdfjs });

  useEffect(() => {
    if (!pdfjs) {
      console.error('pdfjs is not initialized');
      return;
    }
    const renderPdf = async () => {
      const pdf: PDFDocumentProxy = await pdfjs.getDocument(pdfUrl).promise;
      const page = await pdf.getPage(1); // Render the first page, change as needed

      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      await page.render(renderContext).promise;
    };

    renderPdf();
  }, [pdfUrl]);

  return <canvas ref={canvasRef} />;
};

// MainContent component
const MainContent: React.FC = () => {
  const pdfUrl = '/sample.pdf'; // Replace this with the URL of your PDF file

  const [droppedItems, setDroppedItems] = useState<{ text: string; x: number; y: number; }[]>([]);

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const text = e.dataTransfer.getData('text');
    const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const y = e.clientY - e.currentTarget.getBoundingClientRect().top;


    setDroppedItems([...droppedItems, { text, x, y }]);
  };


  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDownload = async () => {

  };

  const captureLayout = async () => {

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

      <div className="w-full relative" style={{ minHeight: '500px' }}>
        <PdfViewer pdfUrl={pdfUrl} />
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

// Comp13 component
const Comp14: React.FC = () => {
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

export default Comp14