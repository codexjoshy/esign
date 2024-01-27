import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
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
 return (
  <div style={{ display: 'flex' }}>
   <div style={{ marginRight: '20px' }}>
    <Document file="/sample.pdf">
     <DropTargetPDFPage pageNumber={1} />
     {/* Render more pages as needed */}
    </Document>
   </div>
  </div>
 );
};

// Drop Target Component on PDF Page
const DropTargetPDFPage: React.FC<{ pageNumber: number }> = ({ pageNumber }) => {
 const [elements, setElements] = useState<{ id: string; text: string; type: string; position: { x: number; y: number } }[]>([]);

 const [, drop] = useDrop({
  accept: ['ITEM_1', 'ITEM_2'],
  drop: (item: { id: string; text: string; type: string }, monitor) => {
   const coordinate = monitor.getClientOffset();
   if (coordinate) {
    const { x, y } = coordinate;
    const offset = monitor.getSourceClientOffset();
    if (offset) {
     const offsetX = x - offset.x;
     const offsetY = y - offset.y;
     // Find the index of the dropped item in the state
     const index = elements.findIndex(el => el.id === item.id);
     if (index !== -1) {
      // Update the position of the dropped item in the state
      const updatedElements = [...elements];
      updatedElements[index].position = { x: offsetX, y: offsetY };
      setElements(updatedElements);
     } else {
      // Add the dropped item to the state if it doesn't exist
      setElements(prev => [...prev, { ...item, position: { x: offsetX, y: offsetY } }]);
     }
    }
   }
  },
 });

 return (
  <div
   ref={drop}
   style={{
    minHeight: '300px',
    position: 'relative',
   }}
  >
   <Page pageNumber={pageNumber}>
    {elements.map((element, index) => (
     <DraggableElement key={index} id={element.id} text={element.text} type={element.type} initialPosition={element.position} />
    ))}
   </Page>
  </div>
 );
};

const DraggableElement: React.FC<{ id: string; text: string; type: string; initialPosition: { x: number; y: number } }> = ({ id, text, type, initialPosition }) => {
 const [{ isDragging }, drag] = useDrag({
  type,
  item: { id, text, type },
  collect: monitor => ({
   isDragging: monitor.isDragging(),
  }),
 });

 const [position, setPosition] = useState<{ x: number; y: number }>(initialPosition);

 const [, drop] = useDrop({
  accept: type,
  drop: (item: { id: string; text: string; type: string }, monitor) => {
   const offset = monitor.getClientOffset();
   if (offset) {
    setPosition({ x: offset.x, y: offset.y });
   }
  },
 });

 return (
  <div
   ref={node => {
    drag(drop(node));
   }}
   style={{
    border: '1px solid blue',
    fontSize: '30px',
    position: 'absolute',
    left: position.x,
    top: position.y,
    cursor: 'move',
    zIndex: 100,
    opacity: isDragging ? 0.5 : 1,
   }}
  >
   {text}
  </div>
 );
};


// Main Component
const Comp7: React.FC = () => {
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

export default Comp7;
