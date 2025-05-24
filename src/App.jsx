import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./components/main_navbar";
import SubNavbar from "./components/sub_navbar";
import InteractiveMain from "./pages/interactive_main";
import BatchMain from "./pages/batch_main";
import ManageDocument from "./pages/manage_document";
import InteractiveDetail from "./pages/interactive_detail";

export default function App() {
  const [page, setPage] = useState("interactive");
  const [isMainNavbar, setMainNavbar] = useState(true);
  const [searchResult, setSearchResult] = useState(null);

  const renderPage = () => {
    switch (page) {
      case "batch":
        return <BatchMain setMainNavbar={setMainNavbar} />;
      case "manage":
        return <ManageDocument />;
      case "interactive_result":
        return <InteractiveDetail result={searchResult} setPage={setPage} />;
      default:
        return <InteractiveMain 
                  setMainNavbar={setMainNavbar} 
                  setSearchResult={setSearchResult}
                  setPage={setPage} />;
    }
  };

  return (
    <Box minH="100vh" bg="white" pb={6}>
      {isMainNavbar ? (
        <Navbar current={page} onChange={setPage} />
      ) : (
        <SubNavbar current={page} onChange={setPage} />
      )}
      {renderPage()}
    </Box>
  );
}
