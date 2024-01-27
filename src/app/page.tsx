'use client'
import DocumentPanelView from './components/DocumentPanelView'
// import { Rnd } from "react-rnd";
// import Draggable from './components/Draggable';
// import { DndProvider } from 'react-dnd';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'


import React from 'react';
// import { Document, Page } from 'react-pdf';
// import Comp1 from './components/Comp1';
// import Comp2 from './components/Comp2';
// import Comp3 from './components/Comp3';
// import Comp4 from './components/Comp4';
// import Comp5 from './components/Comp5';
// import Comp6 from './components/Comp6';
// import Comp7 from './components/Comp7';
// import Comp8 from './components/Comp8';
// import Comp9 from './components/Comp9';
// import Comp10 from './components/Comp10';
// import Comp11 from './components/RND/Comp11';
// import Comp12 from './components/RND/Comp12';
// import Comp13 from './components/RND/Comp13';
// import Comp14 from './components/RND/Comp14';
// import Comp15 from './components/RND/Comp15';
import EsignComp from './components/DND/esignComp';

export default function Home() {
  // return (
  //   <DndProvider backend={HTML5Backend}>
  //     <EsignComp />
  //   </DndProvider>
  // )
  return (
    <DndProvider backend={HTML5Backend}>
      <main className='w-full min-h-[100vh] bg-white flex'>
        <SideBar />

        <main className='w-[80%] bg-blue-50 min-h-[80vh] text-black'>
          <nav className='w-full p-3 bg-white flex items-center justify-center'>
            <div className='w-[60%] h-full flex gap-5 justify-center'>
              <div className='p-2 border-b-2 w-[10%] text-center border-purple-700'>Sign</div>
              <div className='p-2 '>Preview</div>
            </div>
          </nav>
          <section className='w-full h-[100vh] overflow-scroll'>
            <DocumentPanelView />
          </section>

        </main>


      </main>
    </DndProvider>
  )
}

function SideBar() {
  const menus = ["Signature"]
  // const menus = ["Signature", "Initials", "Date Signed", "Name Prefix", "Name", "Phone", "Email", "Text"]
  return (
    <aside className='w-[20%] bg-purple-500 min-h-[80vh] text-black '>
      <div className='p-10'></div>
      {
        menus.map((menu, i) => (
          // <Rnd>
          // <Draggable key={i} >
          <div key={i} className='w-[60%] p-3 flex gap-3 flex-col mb-2 font-semibold text-sm bg-white rounded-md shadow-md'>
            <div className='w-[10%]'></div>
            <div>
              <span className=''>{menu}</span>
            </div>
          </div>
          // </Draggable>
          // </Rnd>
        ))
      }

    </aside>
  )
}





