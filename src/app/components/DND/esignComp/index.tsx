import React from 'react';
import PdfViewer from './PdfViewer';
import Sidebar from './Sidebar';

const EsignComp: React.FC = () => {
 return (
  <div style={{ display: 'flex', height: '100vh' }}>
   <Sidebar />
   <PdfViewer />
  </div>
 );
};

export default EsignComp;
