import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { Rnd } from 'react-rnd';

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
 const [droppedItems, setDroppedItems] = useState<{ text: string; x: number; y: number }[]>([]);

 const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.dataTransfer.getData('text');
  const x = e.clientX - e.currentTarget.getBoundingClientRect().left;
  const y = e.clientY - e.currentTarget.getBoundingClientRect().top;
  setDroppedItems([...droppedItems, { text, x, y }]);
 };

 const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
 };

 return (
  <div className="w-full" onDrop={onDrop} onDragOver={onDragOver}>
   <h2>PDF Viewer</h2>
   <div className="w-full relative" style={{ minHeight: '500px' }}>
    <Document file={pdfUrl}>
     {Array.from(new Array(3), (_, index) => (
      <Page key={index + 1} pageNumber={index + 1} width={800} />
     ))}
    </Document>
    {/* Render dropped items on top of the PDF viewer */}
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
     // default={{
     //  width: 180,
     //  height: 40,
     // }}
     >
      {item.text}
     </Rnd>
    ))}
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
    {/* Map through the menus array and render each menu item */}
    {menus.map((menu, index) => (
     <DraggableText key={index} text={menu} />
    ))}
   </div>
  </div>
 );
};

// Comp11 component
const Comp12: React.FC = () => {
 return (
  <div className="w-full min-h-[100vh] flex bg-blue-50">
   <div className="w-[20%] min-h-[100vh] bg-purple-600">
    <Sidebar /> {/* Include Sidebar component */}
   </div>
   <div className="w-[100%] h-[100vh] overflow-scroll ">
    <MainContent />
   </div>
  </div>
 );
};

export default Comp12;
