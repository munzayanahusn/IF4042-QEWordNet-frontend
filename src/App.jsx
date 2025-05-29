import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Navbar from "./components/main_navbar";
import SubNavbar from "./components/sub_navbar";
import InteractiveMain from "./pages/interactive_main";
import BatchMain from "./pages/batch_main";
import ManageDocument from "./pages/manage_document";
import InteractiveDetail from "./pages/interactive_detail";
import BatchDetailPage from "./pages/batch_detail";
export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem("activePage") || "interactive";
  });
  const [isMainNavbar, setMainNavbar] = useState(true);
  const [searchResult, setSearchResult] = useState(null);

  const renderPage = () => {
    switch (page) {
      case "batch":
        return <BatchMain setMainNavbar={setMainNavbar} setPage={setPage} setSearchResult={setSearchResult}/>;
      case "batch_result":
        return <BatchDetailPage setMainNavbar={setMainNavbar} setPage={setPage} result={searchResult} />
      case "manage":
        return <ManageDocument />;
      case "interactive_result":
        return <InteractiveDetail setMainNavbar={setMainNavbar} result={searchResult} setPage={setPage} />;
      default:
        return <InteractiveMain 
                  setMainNavbar={setMainNavbar} 
                  setSearchResult={setSearchResult}
                  setPage={setPage} />;
    }
  };

  useEffect(() => {
    localStorage.setItem("activePage", page);
  }, [page]);

  return (
    <Box minH="100vh" bg="white" pb={2}>
      {isMainNavbar ? (
        <Navbar current={page} onChange={setPage} />
      ) : (
        <SubNavbar current={page} onChange={setPage} />
      )}
      {renderPage()}
    </Box>
  );
}
