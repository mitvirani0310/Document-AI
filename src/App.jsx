import { useState } from "react";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import KeyValueList from "./Components/KeyValueList/KeyValueList";
import PDFViewer from "./Components/PDFViewer/PDFViewer";
import Split from "react-split";

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [totalMatches, setTotalMatches] = useState(0);

  const [keyValueList] = useState([
    { key: "Name", value: "Mit" },
    { key: "Company", value: "Outamation" },
    { key: "Address", value: "Hyderabad" },
    { key: "Date", value: "01st Dec 2024" },
    { key: "Letter Ref.", value: "50163" },
    { key: "Subject", value: "Confirmation" },
    { key: "Country", value: "India" },
    { key: "data", value: "successful" },
    { key: "website", value: "www.outamation.com" },
    { key: "Office", value: "Fortune" },
    { key: "Office no.", value: "118" },
    { key: "City", value: "Ahmedabad" },
    { key: "Contact email", value: "contactus@outamation.com" },
  ]);
  
  const searchPluginInstance = searchPlugin({
    onHighlightKeyword: (props) => {
      setTotalMatches(props.totalMatch);
      setCurrentMatchIndex(props.currentMatch);
    },
  });

  const { highlight, jumpToNextMatch, jumpToPreviousMatch } = searchPluginInstance;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfFile(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // const handleKeyValueClick = (value) => {
  //   setCurrentMatchIndex(0);
  //   highlight(value);
  //   setTotalMatches(0); // Reset total matches
  //   setTimeout(() => {
  //     const matches = document.querySelectorAll('.rpv-search__highlight');
  //     setTotalMatches(matches.length);
  //     scrollToHighlight();
  //   }, 100);
  // };

  const handleKeyValueClick = (value) => {
    if (searchPluginInstance) {
      searchPluginInstance.highlight(value);
      setCurrentMatchIndex(-1);
      setTotalMatches(0);
  
      // Wait for highlights to be rendered
      setTimeout(() => {
        const matches = document.querySelectorAll('.rpv-search__highlight');
        const total = matches.length;
        setTotalMatches(total);
        
        if (total > 0) {
          setCurrentMatchIndex(0);
          // Scroll to first match
          matches[0].scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  const scrollToHighlight = () => {
    const highlightedElement = document.querySelector(
      ".rpv-search__highlight.rpv-search__highlight--current"
    );
    const pdfContainer = document.querySelector(".pdf-viewer-container");
    if (highlightedElement && pdfContainer) {
      const containerRect = pdfContainer.getBoundingClientRect();
      const elementRect = highlightedElement.getBoundingClientRect();
      const scrollTop =
        elementRect.top -
        containerRect.top +
        pdfContainer.scrollTop -
        containerRect.height / 2;

      pdfContainer.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  const handleNextMatch = () => {
    jumpToNextMatch();
    setTimeout(scrollToHighlight, 100);
  };

  const handlePreviousMatch = () => {
    jumpToPreviousMatch();
    setTimeout(scrollToHighlight, 100);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      <div className="text-center py-3 bg-white shadow-md">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Document AI
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Extract and analyze document information
        </p>
      </div>
      <div className="flex gap-6 p-6 flex-1 overflow-hidden">
        <Split
          className="flex flex-1"
          sizes={[50, 50]}
          minSize={[window.innerWidth * 0.5, 200]}
          gutterSize={8}
          direction="horizontal"
        >
          <PDFViewer
            pdfFile={pdfFile}
            searchPluginInstance={searchPluginInstance}
            onFileUpload={handleFileUpload}
            currentMatchIndex={currentMatchIndex}
            setCurrentMatchIndex={setCurrentMatchIndex}
            totalMatches={totalMatches}
            setTotalMatches={setTotalMatches}
            handleNextMatch={jumpToNextMatch}
            handlePreviousMatch={jumpToPreviousMatch}
          />
          <KeyValueList
            keyValueList={keyValueList}
            handleKeyValueClick={handleKeyValueClick}
          />
        </Split>
      </div>
    </div>
  );
};

export default App;
