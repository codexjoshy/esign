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
    setElements(prev => [...prev, { ...item, position: { x, y } }]);
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
     <DraggableElement key={index} element={element} setElements={setElements} />
    ))}
   </Page>
  </div>
 );
};

// Draggable Element Component
const DraggableElement: React.FC<{ element: { id: string; text: string; type: string; position: { x: number; y: number } }; setElements: React.Dispatch<React.SetStateAction<{ id: string; text: string; type: string; position: { x: number; y: number } }[]>> }> = ({ element, setElements }) => {
 const [, drag] = useDrag({
  type: element.type,
  item: element,
  collect: monitor => ({
   isDragging: monitor.isDragging(),
  }),
 });

 const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
  const { offsetX, offsetY } = e.nativeEvent;
  setElements(prev => prev.map(el => el.id === element.id ? { ...el, position: { x: offsetX, y: offsetY } } : el));
 };

 return (
  <div
   ref={drag}

   style={{
    border: '3px solid blue',
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    cursor: 'move',
    zIndex: 100
   }}
   onDrag={handleDrag}
   draggable
  >
   <span onClick={() => alert(element.text)}>

    {element.text}
   </span>
  </div>
 );
};

// Main Component
const Comp4: React.FC = () => {
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

export default Comp4;
