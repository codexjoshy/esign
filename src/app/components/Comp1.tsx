import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Document, Page } from "react-pdf";

// Draggable Sidebar Item Component
const DraggableSidebarItem: React.FC<{ id: string; text: string }> = ({ id, text }) => {
 const [{ isDragging }, drag] = useDrag({
  type: 'SIDEBAR_ITEM',
  item: { id, text },
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
     <DropTargetPDFPage pageNumber={1}>
      <Page pageNumber={1} />

     </DropTargetPDFPage>
     {/* Render more pages as needed */}
    </Document>
   </div>
  </div>
 );
};

// Drop Target Component on PDF Page
const DropTargetPDFPage: React.FC<{ pageNumber: number; children: React.ReactNode }> = ({ pageNumber, children }) => {
 const [{ canDrop, isOver }, drop] = useDrop({
  accept: 'SIDEBAR_ITEM',
  drop: (item: { id: string; text: string }) => {
   // Handle drop event here
   console.log(`Dropped item ${item.text} onto PDF page ${pageNumber}`);
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
   }}
  >
   {children}
   {pageNumber}
  </div>
 );
};

// Main Component
const Comp1: React.FC = () => {
 return (
  <DndProvider backend={HTML5Backend}>
   <div style={{ display: 'flex' }}>
    <div style={{ marginRight: '20px' }}>
     {/* Sidebar with draggable items */}
     <DraggableSidebarItem id="1" text="Item 1" />
     <DraggableSidebarItem id="2" text="Item 2" />
     {/* Add more draggable sidebar items as needed */}
    </div>
    <MainContent />
   </div>
  </DndProvider>
 );
};

export default Comp1;


