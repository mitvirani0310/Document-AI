import { useState } from "react";
import { searchPlugin } from "@react-pdf-viewer/search";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";
import KeyValueList from "./Components/KeyValueList/KeyValueList";
import PDFViewer from "./Components/PDFViewer/PDFViewer";

const App = () => {
  const [pdfFile, setPdfFile] = useState(null);

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
  // const [keyValueList] = useState([
  //   { key: "Chapter1", value: "Tell My People I am Safe" },
  //   { key: "Chapter2", value: "The Attributes of a Tyagi" },
  //   {
  //     key: "Chapter3",
  //     value: "Gives Darshan to Veniram and Revives Raghunandan",
  //   },
  //   { key: "Chapter4", value: "Liberating Ascetics" },
  //   { key: "Chapter5", value: "On the Way to Badrinath" },
  //   { key: "Chapter6", value: "Spurns Mahantship" },
  //   { key: "Chapter7", value: "Visits Badrinath and Manas Sarovar" },
  //   { key: "Chapter8", value: "Discourse to Maharaja" },
  //   { key: "Chapter9", value: "Compassionate Nilkanth" },
  //   { key: "Chapter10", value: "Nilkanth in Vanshipur" },
  //   { key: "Chapter11", value: "Enters a Dense Forest" },
  //   {
  //     key: "Chapter12",
  //     value: "Destruction of Ghosts and Deliverance of Yogis",
  //   },
  //   { key: "Chapter13", value: "Meeting with Himalaya" },
  //   { key: "Chapter14", value: "Intense Austerities at Pulhashram" },
  //   { key: "Chapter15", value: "Mohandas Meets Nilkanth" },
  //   { key: "Chapter16", value: "At the Palace of King Mahadatt" },
  //   { key: "Chapter17", value: "Meeting Gopal Yogi" },
  //   { key: "Chapter18", value: "Blesses the King of Nepal" },
  //   { key: "Chapter19", value: "Liberates the Telangi Brahmin" },
  //   { key: "Chapter20", value: "Defeat of Pibek" },
  //   { key: "Chapter21", value: "Uplift of 900,000 Yogis" },
  //   { key: "Chapter22", value: "Religious Preaching" },
  //   { key: "Chapter23", value: "Nilkanth at the House of Jairamdas" },
  //   { key: "Chapter24", value: "Liberation of Jambuvan" },
  //   { key: "Chapter25", value: "Nilkanth Leaves Jairam’s House" },
  //   { key: "Chapter26", value: "Reunion with Nilkanth" },
  //   { key: "Chapter27", value: "Nilkanth in Jagannathpuri" },
  //   { key: "Chapter28", value: "Destruction of Asuras in Manaspur" },
  //   { key: "Chapter29", value: "Liberation of Rata Bashiya" },
  //   { key: "Chapter30", value: "Ungrateful Sevakram" },
  //   { key: "Chapter31", value: "Bhagwandas Has Darshan of Sacred Foot-Marks" },
  //   { key: "Chapter32", value: "Shiv-Parvati Come for Darshan of Nilkanth" },
  //   { key: "Chapter33", value: "Nilkanth in Totadri" },
  //   { key: "Chapter34", value: "Northwards from Kanyakumari" },
  //   { key: "Chapter35", value: "Nilkanth in Gujarat" },
  //   { key: "Chapter36", value: "Nilkanth at Bochasan" },
  //   { key: "Chapter37", value: "Leather-Touched Water Is Impure" },
  //   { key: "Chapter38", value: "Who Gave the Right to Kill?" },
  //   { key: "Chapter39", value: "Revealing His Divinity" },
  //   { key: "Chapter40", value: "Nilkanth at the House of Lakhu Charan" },
  //   { key: "Chapter41", value: "The Story of Ramanand Swami" },
  //   { key: "Chapter42", value: "Darshan to Narsinh Mehta" },
  //   { key: "Chapter43", value: "Nilkanth in Loj" },
  //   { key: "Chapter44", value: "Significance of Nilkanth’s Travels" },
  //   { key: "Chapter45", value: "Darshan in Two Forms" },
  //   { key: "Chapter46", value: "Separate Assemblies for Men and Women" },
  //   { key: "Chapter47", value: "Plugged the Hole in the Wall" },
  //   { key: "Chapter48", value: "Cling to the Pillar" },
  //   { key: "Chapter49", value: "Miracles Galore" },
  //   { key: "Chapter50", value: "Letter to Ramanand Swami" },
  //   { key: "Chapter51", value: "The Glory of Nilkanth" },
  //   { key: "Chapter52", value: "Meeting Ramanand Swami" },
  //   { key: "Chapter53", value: "The Police Chief Experiences Samadhi" },
  //   { key: "Chapter54", value: "Receives Vaishnavi Diksha" },
  //   { key: "Chapter55", value: "Appointed as Head of Fellowship" },
  //   { key: "Chapter56", value: "The Passing Away of Ramanand Swami" },
  // ]);

  const searchPluginInstance = searchPlugin();
  const { highlight } = searchPluginInstance;

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

  const handleKeyValueClick = (value) => {
    highlight(value);
    setTimeout(() => {
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
    }, 100);
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
        <PDFViewer
          pdfFile={pdfFile}
          searchPluginInstance={searchPluginInstance}
          onFileUpload={handleFileUpload}
        />
        <KeyValueList
          keyValueList={keyValueList}
          handleKeyValueClick={handleKeyValueClick}
        />
      </div>
    </div>
  );
};

export default App;
