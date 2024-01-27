import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';

// DraggableText component
interface DraggableTextProps {
 text: string;
}

const DraggableText: React.FC<DraggableTextProps> = ({ text }) => {
 const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
  e.dataTransfer.setData("text", text);
 };

 return (
  <div draggable onDragStart={onDragStart}>
   {text}
  </div>
 );
};

// Sidebar component
const Sidebar: React.FC = () => {
 // Define the array of menu items
 const menus = ["Signature", "Initials", "Date Signed", "Name Prefix", "Name", "Phone", "Email", "Text"];

 return (
  <div className='w-full h-full p-9'>
   <div className='w-full h-12 bg-yellow-100 relative'>
    {/* Map through the menus array and render each menu item */}
    {menus.map((menu, index) => (
     <DraggableText key={index} text={menu} />
    ))}
   </div>
  </div>
 );
};

// MainContent component
const MainContent: React.FC = () => {
 const pdfUrl = '/sample.pdf'; // Replace this with the URL of your PDF file
 const [droppedItems, setDroppedItems] = useState<{ text: string; x: number; y: number }[]>([]);

 const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.dataTransfer.getData("text");
  const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
  const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
  setDroppedItems([...droppedItems, { text, x, y }]);
 };

 const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
 };

 return (
  <div className='w-full' onDrop={onDrop} onDragOver={onDragOver}>
   <h2>PDF Viewer</h2>
   <div className='w-full relative'>
    <Document file={pdfUrl}>
     <Page pageNumber={1} width={800} className="w-full" />
    </Document>
    {/* Render dropped items on top of the PDF viewer */}
    {droppedItems.map((item, index) => (
     <Rnd
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
      position={{ x: item.x, y: item.y }} // Specify the initial position using the position prop
      size={{ width: 180, height: 40 }} // Specify the size
      key={index}
     >
      {item.text}
     </Rnd>

    ))}
   </div>
  </div>
 );
};

// Comp11 component
const Comp12: React.FC = () => {
 return (
  <div className='w-full min-h-[100vh] flex bg-blue-50'>
   <div className='w-[20%] min-h-[100vh] bg-purple-600'>
    <Sidebar /> {/* Include Sidebar component */}
   </div>
   <div className='w-[30%] min-h-[100vh]'>
    <MainContent />
   </div>
  </div>
 );
};

export default Comp12;
