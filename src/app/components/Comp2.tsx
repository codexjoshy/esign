import React, { useState } from 'react';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Document, Page } from 'react-pdf';

// Draggable Sidebar Item Component
const DraggableSidebarItem: React.FC<{ id: string; text: string; type: string }> = ({ id, text, type }) => {
 const [{ isDragging }, drag] = useDrag({
  type,
  item: { id, text, type },
  collect: monitor => ({
   isDragging: monitor.isDragging(),
  }),
 });

 return (
  <div
   ref={drag}
   style={{
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    marginBottom: '8px', // Adjust spacing as needed
   }}
  >
   {text}
  </div>
 );
};

// Main Content Component with PDF Viewer
const MainContent: React.FC = () => {
 const [elements, setElements] = useState<JSX.Element[]>([]);

 return (
  <div style={{ display: 'flex' }}>
   <div style={{ marginRight: '20px' }}>
    <Document file="/sample.pdf">
     <DropTargetPDFPage pageNumber={1} onDropItem={(element) => setElements(prev => [...prev, element])} />
     {/* Render more pages as needed */}
    </Document>
   </div>
   <div>
    {elements.map((element, index) => (
     // Ensure each dynamically rendered element has a unique key
     <div key={index}>{element}</div>
    ))}
   </div>
  </div>
 );
};

// Drop Target Component on PDF Page
const DropTargetPDFPage: React.FC<{ pageNumber: number; onDropItem: (element: JSX.Element) => void }> = ({ pageNumber, onDropItem }) => {
 const [{ canDrop, isOver }, drop] = useDrop({
  accept: ['ITEM_1', 'ITEM_2'],
  drop: (item: { id: string; text: string; type: string }, monitor) => {
   const coordinate = monitor.getClientOffset();
   if (coordinate) {
    const { x, y } = coordinate;
    const element = item.type === 'ITEM_1' ? <h1 style={{ position: 'absolute', top: y, left: x, color: 'red', fontSize: '30px' }}>THIS IS AN H1 ELEMENT</h1> : <h2 style={{ position: 'absolute', top: y, left: x, color: 'red', fontSize: '30px' }}> THIS IS AN H2 ELEMENT</h2>;
    onDropItem(element);
   }
  },
  collect: monitor => ({
   isOver: monitor.isOver(),
   canDrop: monitor.canDrop(),
  }),
 });

 const isActive = canDrop && isOver;

 return (
  <div
   ref={drop}
   style={{
    border: isActive ? '2px dashed red' : 'none',
    minHeight: '300px',
    position: 'relative',
   }}
  >
   <Page pageNumber={pageNumber} />
  </div>
 );
};

// Main Component
const Comp2: React.FC = () => {
 return (
  <DndProvider backend={HTML5Backend}>
   <div style={{ display: 'flex' }}>
    <div style={{ marginRight: '20px' }}>
     {/* Sidebar with draggable items */}
     <DraggableSidebarItem id="1" text="Item 1" type="ITEM_1" />
     <DraggableSidebarItem id="2" text="Item 2" type="ITEM_2" />
    </div>
    <MainContent />
   </div>
  </DndProvider>
 );
};

export default Comp2;
