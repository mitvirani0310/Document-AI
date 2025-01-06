import React, { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { FiUpload, FiDownload, FiSearch, FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme } = useTheme();

  useEffect(() => {
    if (!searchQuery) {
      setTotalMatches(0);
      setCurrentMatchIndex(-1);
    }
  }, [searchQuery, setTotalMatches, setCurrentMatchIndex]);

  const scrollToMatch = (index) => {
    const matches = document.querySelectorAll('.rpv-search__highlight');
    if (matches[index]) {
      matches[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
      setCurrentMatchIndex(-1);
      setTotalMatches(0);

      setTimeout(() => {
        const matches = document.querySelectorAll('.rpv-search__highlight');
        const total = matches.length;
        setTotalMatches(total);
        
        if (total > 0) {
          setCurrentMatchIndex(0);
          scrollToMatch(0);
        }
      }, 100);
    }
  };

  const handleLocalNextMatch = () => {
    if (currentMatchIndex < totalMatches - 1) {
      const nextIndex = currentMatchIndex + 1;
      setCurrentMatchIndex(nextIndex);
      handleNextMatch();
      scrollToMatch(nextIndex);
    }
  };

  const handleLocalPreviousMatch = () => {
    if (currentMatchIndex > 0) {
      const prevIndex = currentMatchIndex - 1;
      setCurrentMatchIndex(prevIndex);
      handlePreviousMatch();
      scrollToMatch(prevIndex);
    }
  };

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg flex flex-col overflow-hidden`}>
      <div className="flex items-center justify-between gap-4 p-4">
        <div
          className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-lg ${
            isDragging ? `border-blue-500 ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-50'}` : `${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`
          } cursor-pointer transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{ height: "50px" }}
        >
          <label className="flex items-center gap-2 cursor-pointer">
            <FiUpload className={`${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'} text-lg`} />
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            {isControlsVisible ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        )}
      </div>

      {isControlsVisible && pdfFile && (
        <div className="flex flex-col gap-2 px-4 pb-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
              }`}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />

            <button
              onClick={handleSearch}
              className={`p-2 ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-lg text-sm`}
            >
              <FiSearch />
            </button>

            <button
              onClick={handleLocalPreviousMatch}
              disabled={currentMatchIndex <= 0 || totalMatches <= 1}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FiChevronLeft />
            </button>

            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {totalMatches > 0 
                ? `Match ${currentMatchIndex + 1} of ${totalMatches}` 
                : 'No matches'}
            </span>

            <button
              onClick={handleLocalNextMatch}
              disabled={currentMatchIndex >= totalMatches - 1 || totalMatches <= 1}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <FiChevronRight />
            </button>

            <ZoomOutButton />
            <ZoomPopover />
            <ZoomInButton />

            <button
              onClick={handleDownload}
              className={`px-2 py-2 ${theme === 'dark' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'} rounded-lg flex items-center gap-2 text-xs`}
            >
              <FiDownload />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>
      )}

      {pdfFile ? (
        <div className={`pdf-viewer-container flex-1 border rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} overflow-auto`}>
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfFile}
              plugins={[searchPluginInstance, zoomPluginInstance]}
              scrollMode="vertical"
              defaultScale={1}
              theme={theme}
            />
          </Worker>
        </div>
      ) : (
        <div className={`flex-1 flex items-center justify-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No PDF file selected
        </div>
      )}
    </div>
  );
};

export default PDFViewer;

