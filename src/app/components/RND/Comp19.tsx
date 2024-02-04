import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Document, Page } from 'react-pdf';
import { PDFDocument, rgb } from 'pdf-lib';
// Sidebar component
const Sidebar: React.FC = () => {
  const menus = ['Signature', 'Initials', 'Date Signed', 'Name Prefix', 'Name', 'Phone', 'Email', 'Text'];
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(prevMenu => (prevMenu === menu ? null : menu)); // Toggle selection
  };

  return (
    <div className="w-full h-full p-9">
      <div className="w-full h-12 relative">
        {/* Sidebar content */}
        <ul>
          {menus.map((menu, index) => (
            <li
              key={index}
              className={`cursor-pointer ${selectedMenu === menu ? 'bg-gray-300 text-gray-800 shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 shadow-sm'}`}
              onClick={() => handleMenuClick(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

interface DraggableItemProps {
  id: string;
  x: number;
  y: number;
  text: string;
  onDragStop: (id: string, x: number, y: number, text: string) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ id, x, y, text, onDragStop }) => {
  const handleDragStop = (event: any, data: any) => {
    onDragStop(id, data.x, data.y, text);
  };

  return (
    <Rnd
      default={{
        x: x,
        y: y,
        width: 100,
        height: 50
      }}
      style={{zIndex:300}}
      onDragStop={handleDragStop}
    >
      <div className="absolute bg-green-500" style={{ padding: '5px' }}>
        {text}
      </div>
    </Rnd>
  );
};

interface Square {
  id: string;
  x: number;
  y: number;
  text: string;
}

interface PageContainerProps {
  label: string;
  pageNumber: number;
  value: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ label, pageNumber, value }) => {
  const [coordinates, setCoordinates] = useState<{ x: number; y: number; value: any }>({ x: 0, y: 0, value });
  const [squares, setSquares] = useState<Square[]>([]);
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState(1);

  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });


  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    setCoordinates({ x, y, value });
  };

  const handleDragStop = (id: string, x: number, y: number, text: string) => {
    setSquares(prevSquares =>
      prevSquares.map(square => (square.id === id ? { ...square, x, y } : square))
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

  
    const options = { id: `item${nextId}`, x, y, text: value };
    console.log({options });
    const container = document.getElementById('page-1');
    const containerRect = container!.getBoundingClientRect();
   
    console.log({containerRect, rect, containerDimensions});
    
    setSquares(prevSquares => [...prevSquares, options]);
    setNextId(prevId => prevId + 1);
  };

  // Calculate bounds dynamically based on PageContainer dimensions
  const bounds = pageContainerRef.current
    ? {
        left: 0,
        top: 0,
        right: pageContainerRef.current.clientWidth - 100, // Adjust 100 according to dragged item width
        bottom: pageContainerRef.current.clientHeight - 50 // Adjust 50 according to dragged item height
      }
    : undefined;
    
    useEffect(() => {
        if (pageContainerRef.current) {
          const { width, height } = pageContainerRef.current.getBoundingClientRect();
          setContainerDimensions({ width, height });
        }
      }, [pageContainerRef]);



  return (
    <div
     id={`page-${pageNumber}`}
      className='w-full h-fit bg-slate-300  gap-y-5 relative'
      onMouseMove={handleMouseMove}
      onClick={handleClick} // Handle click event to add dropped items
      data-page={pageNumber}
      ref={pageContainerRef}
    >
      <div className='text-center'>{label}: {coordinates.x}, {coordinates.y}</div>
      {squares.map(square => (
        <DraggableItem
          key={square.id}
          id={square.id}
          x={square.x}
          y={square.y}
          text={square.text}
          onDragStop={handleDragStop}
        />
      ))}
      <Page pageNumber={pageNumber} width={1000} />
    </div>
  );
};

const MainContent: React.FC = () => {
  const labels = ['Hovering coordinates (Div 1)', 'Hovering coordinates (Div 2)', 'Hovering coordinates (Div 3)'];
  const [selectedMenu, setSelectedMenu] = useState("");
  const [numPages, setNumPages] = useState(1);
    const ref = useRef(null)
 // Function to convert browser coordinates to pdf-lib coordinates
const convertBrowserToPdfCoordinates2 = (pageWidth: number, pageHeight: number, containerWidth: number, xBrowser: number, yBrowser: number): { x: number, y: number } => {
    // Scale the x-coordinate based on the ratio of the container width to the page width
    const xPdf: number = (xBrowser / containerWidth) * pageWidth;

    // Calculate the y-coordinate by subtracting the browser y-coordinate from the container height
    // This ensures the y-coordinate starts from the bottom of the container and increases upwards
    const yPdf: number = pageHeight -( yBrowser - 220) ;

    // const yPdf: number = pageHeight - yBrowser ;
    console.log({pageHeight, yPdf,yBrowser, pageWidth});
    
    return { x: xPdf, y: yPdf };
};
  
const convertBrowserToPdfCoordinates = (
    pdfWidth: number,
    pdfHeight: number,
    containerWidth: number,
    containerHeight: number,
    x: number,
    y: number
  ): {x:number; y:number} => {
    const scaleX: number = pdfWidth / containerWidth;
    const scaleY: number = pdfHeight / containerHeight;
  
    const pdfX: number = x * scaleX;
    const pdfY: number = (containerHeight - (y - 0)) * scaleY;
    console.log({pdfHeight, pdfWidth});
    return { x: pdfX, y: pdfY };
  };

  const handleDownload = async () => {
    try {
      // Fetch the existing PDF file
      const response = await fetch('/sample.pdf');
      const existingPdfBytes = await response.arrayBuffer();
  
      // Load the existing PDF document
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
      // Get the first page of the PDF document
      const page = pdfDoc.getPage(2);
      let x = 493.3347473144531;      
      let y = 695.0515975952148;

      const position = convertBrowserToPdfCoordinates(page.getWidth(), page.getHeight(), 1000, 1291, x, y )
  
      // Add text at position (242, 89) on page 1
      page.drawText('Your Text Here', {
        x: position.x,
        y:  position.y ,
        size: 12,
        color: rgb(0, 0, 0), // Black color
      });
  
      // Serialize the modified PDF document to bytes
      const modifiedPdfBytes = await pdfDoc.save();
  
      // Create a Blob from the PDF bytes
      const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  
      // Create a temporary URL for the Blob
      const url = window.URL.createObjectURL(blob);
  
      // Create a link element and click it to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'modified_pdf.pdf'; // Specify the file name
      document.body.appendChild(link);
      link.click();
  
      // Cleanup by revoking the temporary URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const scrollTop = e.currentTarget.scrollTop || 0;
    console.log({scrollTop});
    
    // Use scrollTop as needed
  };
  return (
    <div className="w-full">
      <h2>PDF Viewer</h2>
      <div className='w-full flex gap-3'>
        <button className="p-2 bg-blue-600" onClick={handleDownload}>
          Download Modified PDF
        </button>
        <button className="p-2 bg-purple-600">
          Capture PDF
        </button>
      </div>
      <div onScroll={(e)=>handleScroll(e)} className="w-[1000px] relative min-h-[100vh] overflow-y-scroll bg-red-400 flex flex-col gap-y-5">
      <Document
          file="/sample.pdf"
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <PageContainer key={index} pageNumber={index + 1} label={''} value={''} />
          ))}
        </Document>
       
      </div>
    </div>
  );
};

const Comp19: React.FC = () => {
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

export default Comp19;
