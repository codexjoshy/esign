import { Degrees, degrees, PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import { useEffect, useState } from 'react';
import download from "downloadjs";

type PropsType = {
 pdfUrl: PDFFile;
}

type PDFFile = string;

type PageOptions = {
 x: number;
 y: number;
 size?: number;
 font?: PDFFont;
 color?: any; // Assuming color type is any, you can replace it with a specific type
 rotate?: Degrees;
 type: 'text' | 'image';
};

export type ModifiedPage = {
 page: number;
 id?: number;
 value: any;
 options: PageOptions;
};

function useDocumentModifier({ pdfUrl }: PropsType) {
 const [newPdfDoc, setPdfDoc] = useState<PDFDocument>();
 const [newFont, setFont] = useState<PDFFont>();
 const [newUrl] = useState<string>(pdfUrl);
 const [modifiedPages, setModifiedPages] = useState<ModifiedPage[]>([]);

 useEffect(() => {
  setNewPdfDoc(newUrl);
 }, [newUrl])

 const setNewPdfDoc = async (pdfUrl: string) => {
  const existingPdfBytes = await fetch(pdfUrl, { cache: "no-store" }).then(res => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  setPdfDoc(pdfDoc)
  setFont(helveticaFont)
 }

 const setPageOptions = (newOptions: ModifiedPage) => {
  setModifiedPages(prevPages => [...prevPages, newOptions]);
 }

 // Update the options of a modified page by its ID
 const updatePageOptions = (id: number, newOptions: ModifiedPage) => {
  setModifiedPages(prevPages =>
   prevPages.map(page => {
    if (page.id === id) {
     return {
      ...page,
      options: newOptions.options,
     };
    }
    return page;
   })
  );
 };

 const getPdfDimension = () => {
  console.log({ newPdfDoc });

  if (newPdfDoc) {
   let pdfPage = newPdfDoc.getPages()[0];
   return {
    height: pdfPage.getHeight(),
   }
  }
 }

 const downloadPDF = async () => {
  if (newPdfDoc) {
   const groupedPages: Record<number, ModifiedPage[]> = modifiedPages.reduce((acc, { page, value, options }) => {
    acc[page] = acc[page] ? [...acc[page], { page, value, options }] : [{ page, value, options }];
    return acc;
   }, {} as Record<number, ModifiedPage[]>);

   let pdfPages = newPdfDoc.getPages();
   Object.keys(groupedPages).forEach(pageNumber => {
    const pageMods = groupedPages[parseInt(pageNumber)];
    const page = pdfPages[parseInt(pageNumber) - 1];
    pageMods.forEach(mod => {
     if (mod.options.type === 'text') {
      page.drawText(mod.value, {
       x: mod.options.x,
       y: mod.options.y,
       size: mod.options.size || 12,
       font: mod.options.font || newFont,
       color: mod.options.color || rgb(0, 0, 0),
       rotate: mod.options.rotate || degrees(0)
      });
     }
     // Add more conditions for other types like images
    });
   });

   const pdfBytes = await newPdfDoc.save(); // Return the modified PDF bytes
   download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
  }
 }

 return {
  downloadPDF,
  setNewPdfDoc,
  setPageOptions,
  updatePageOptions,
  getPdfDimension
 };
}

export default useDocumentModifier;
