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
 const [elements, setElements] = useState<{ id: string; text: string; type: string }[]>([]);

 const handleDropItem = (item: { id: string; text: string; type: string }, coordinate: { x: number; y: number }) => {
  setElements(prev => [...prev, { ...item, position: coordinate }]);
 };

 return (
  <div style={{ display: 'flex' }}>
   <div style={{ marginRight: '20px' }}>
    <Document file="/sample.pdf">
     <DropTargetPDFPage pageNumber={1} onDropItem={handleDropItem} />
     {/* Render more pages as needed */}
    </Document>
   </div>
   <div>
    {elements.map((element, index) => (
     <DraggableElement key={index} element={element} />
    ))}
   </div>
  </div>
 );
};

// Drop Target Component on PDF Page
const DropTargetPDFPage: React.FC<{ pageNumber: number; onDropItem: (item: { id: string; text: string; type: string }, coordinate: { x: number; y: number }) => void }> = ({ pageNumber, onDropItem }) => {
 const [{ canDrop, isOver }, drop] = useDrop({
  accept: ['ITEM_1', 'ITEM_2'],
  drop: (item: { id: string; text: string; type: string }, monitor) => {
   const coordinate = monitor.getClientOffset();
   if (coordinate) {
    const { x, y } = coordinate;
    onDropItem(item, { x, y });
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

// Draggable Element Component
const DraggableElement: React.FC<{ element: { id: string; text: string; type: string; position?: { x: number; y: number } } }> = ({ element }) => {
 const [{ isDragging }, drag] = useDrag({
  type: element.type,
  item: element,
  collect: monitor => ({
   isDragging: monitor.isDragging(),
  }),
 });

 const positionStyle = element.position ? { left: element.position.x, top: element.position.y } : {};

 return (
  <div
   ref={drag}
   style={{
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    position: 'absolute',
    ...positionStyle,
   }}
  >
   {element.text}
  </div>
 );
};


// Main Component
const Comp3: React.FC = () => {
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

export default Comp3;
