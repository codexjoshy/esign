'use client'
import React, { useState } from "react";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";

import { useDrag } from 'react-dnd'

interface RndState {
 width: number;
 height: number;
 x: number;
 y: number;
}

type DraggableType = {
 children: React.ReactNode,
}
const Draggable = ({ children }: DraggableType) => {
 const [{ opacity }, dragRef] = useDrag(
  () => ({
   type: 'Drag',
   item: { text: 'Dragged' },
   collect: (monitor) => ({
    isDragging: monitor.isDragging(),
    opacity: monitor.isDragging() ? 0.5 : 1
   })
  }),
  []
 )
 return (
  <div ref={dragRef}>
   {children}
  </div>
 )
}

const DraggableRND = ({ children, className }: { children: React.ReactNode, className: string; }) => {
 const [RND, setRND] = useState<RndState>({ width: 200, height: 200, x: 10, y: 10 });

 const changePosition: RndDragCallback = (_, d) => {
  setRND(prevState => ({ ...prevState, x: d.x, y: d.y }));
 };

 const changeSize: RndResizeCallback = (_, __, ref) => {
  if (ref) {
   setRND(prevState => ({
    ...prevState,
    width: ref.offsetWidth,
    height: ref.offsetHeight
   }));
  }
 };


 return (
  <Rnd
   className={className}
   bounds=".react-pdf__Page__canvas"
   size={{ width: RND.width, height: RND.height }}
   position={{ x: RND.x, y: RND.y }}
   onDrag={changePosition}
   onResize={changeSize}
  >
   {children}
  </Rnd>
 );
};

export default Draggable;
