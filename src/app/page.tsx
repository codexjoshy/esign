'use client'
import DocumentPanelView from './components/DocumentPanelView'
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'


import React from 'react';
// import { Document, Page } from 'react-pdf';
import Comp13 from './components/RND/Comp13';
import EsignComp from './components/DND/esignComp';

export default function Home() {
  return <Comp13 />
  return (
    <DndProvider backend={HTML5Backend}>
      <EsignComp />
    </DndProvider>
  )

}




