'use client'
import React from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

interface DraggableElementProps {
 type: string;
 text: string;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ type, text }) => {
 const [, dragRef, preview] = useDrag({
  type,
  item: { type },
  collect: (monitor) => ({
   isDragging: monitor.isDragging(),
  }),
 });

 // Attach preview image for dragged element
 if (typeof Image !== 'undefined') {
  preview(getEmptyImage(), { captureDraggingState: true });
 }

 return (
  <div
   ref={dragRef}
   style={{
    border: '1px dashed #ccc',
    padding: '5px',
    marginBottom: '10px',
    cursor: 'move',
    backgroundColor: 'lightgray',
   }}
  >
   {text}
  </div>
 );
};

interface SidebarProps { }

const Sidebar: React.FC<SidebarProps> = () => {
 return (
  <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
   <h2>Draggable Elements</h2>
   <DraggableElement type="signature" text="Signature" />
   <DraggableElement type="initials" text="Initials" />
   <DraggableElement type="name" text="Name" />
  </div>
 );
};

export default Sidebar;
