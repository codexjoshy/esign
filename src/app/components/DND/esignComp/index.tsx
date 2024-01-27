import React from 'react';
import PdfViewer3 from './PdfViewer3';
import Sidebar from './Sidebar';

const EsignComp: React.FC = () => {
 return (
  <div style={{ display: 'flex', height: '100vh' }}>
   <Sidebar />
   <PdfViewer3 />
  </div>
 );
};

export default EsignComp;
