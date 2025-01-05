import React, { useState } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { FiUpload, FiDownload, FiSearch, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const PDFViewer = ({ 
  pdfFile, 
  searchPluginInstance, 
  onFileUpload,
  currentMatchIndex,
  setCurrentMatchIndex,
  totalMatches,
  setTotalMatches,
  handleNextMatch,
  handlePreviousMatch
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const zoomPluginInstance = zoomPlugin();
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        onFileUpload({ target: { files: [file] } });
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleDownload = () => {
    if (pdfFile) {
      const link = document.createElement("a");
      link.href = pdfFile;
      link.download = "document.pdf";
      link.click();
    }
  };

  const handleSearch = () => {
    if (searchQuery && searchPluginInstance) {
      searchPluginInstance.highlight(searchQuery);
      setCurrentMatchIndex(0);
      setTotalMatches(0);
      setTimeout(() => {
        const matches = document.querySelectorAll('.rpv-search__highlight');
        setTotalMatches(matches.length);
      }, 100);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-4 p-4">
        <div
          className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-lg ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"} cursor-pointer transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ height: "50px" }}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <FiUpload className="text-blue-500 text-lg" />
            <span className="text-sm text-gray-600">
              {isDragging ? "Drop PDF here" : "Drop PDF here or click to upload"}
            </span>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={onFileUpload}
            />
          </label>
        </div>

        {pdfFile && (
          <button
            onClick={() => setIsControlsVisible(!isControlsVisible)}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            {isControlsVisible ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>

      {isControlsVisible && pdfFile && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          <div className="flex items-center gap-4">
            {/* Search Box */}
            <input
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              <FiSearch />
            </button>

            {/* Previous Match Button */}
            <button
              onClick={handlePreviousMatch}
              disabled={currentMatchIndex <= 0 || totalMatches === 0}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft />
            </button>

            {/* Match Info */}
            <span className="text-sm text-gray-600">
              {totalMatches > 0 ? `Match ${currentMatchIndex + 1} of ${totalMatches}` : 'No matches'}
            </span>

            {/* Next Match Button */}
            <button
              onClick={handleNextMatch}
              disabled={currentMatchIndex >= totalMatches - 1 || totalMatches === 0}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight />
            </button>

            {/* Zoom Controls */}
            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />

            {/* Download Button with reduced size */}
            <button
              onClick={handleDownload}
              className="px-2 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 text-xs"
            >
              <FiDownload />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>
      )}

      {pdfFile ? (
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
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          No PDF file selected
        </div>
      )}
    </div>
  );
};

export default PDFViewer;
