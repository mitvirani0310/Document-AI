import React from "react";
import { Worker, Viewer, Icon } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";

const PDFViewer = ({ pdfFile, searchPluginInstance, onFileUpload }) => {
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const handleDownload = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = "document.pdf";
      link.click();
    }
  };

  return (
    <div className="w-1/2 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className={`flex items-center ${!pdfFile ? 'justify-center' : 'justify-between'} p-4`}>
        <label className="flex items-center px-3 py-2 bg-white text-blue-500 rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition duration-300 text-sm">
          <span>Upload PDF</span>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={onFileUpload}
          />
        </label>
        {pdfFile && (
          <div className="flex items-center gap-2">
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />
            <button
              onClick={handleDownload}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
            >
              <Icon>
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              </Icon>
              <span>Download</span>
            </button>
          </div>
        )}
      </div>
      {pdfFile && (
        <div className="pdf-viewer-container flex-1 border rounded-lg shadow-inner bg-gray-50 overflow-auto">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[searchPluginInstance, zoomPluginInstance]}
              scrollMode="vertical"
              defaultScale={1}
            />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PDFViewer;

