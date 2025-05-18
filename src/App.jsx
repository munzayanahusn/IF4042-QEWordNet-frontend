import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "./components/main_navbar";
import SubNavbar from "./components/sub_navbar";
import InteractiveMain from "./pages/interactive_main";
import BatchMain from "./pages/batch_main";
import ManageDocument from "./pages/manage_document";


export default function App() {
  const [page, setPage] = useState("interactive");
  const [isMainNavbar, setMainNavbar] = useState(true);

  const renderPage = () => {
    switch (page) {
      case "batch":
        return <BatchMain setMainNavbar={setMainNavbar} />;
      case "manage":
        return <ManageDocument />;
      default:
        return <InteractiveMain setMainNavbar={setMainNavbar} />;
    }
  };

  return (
    <Box minH="100vh" bg="white" py={6} px={8}>
      {isMainNavbar ? (
        <Navbar current={page} onChange={setPage} />
      ) : (
        <SubNavbar current={page} onChange={setPage} />
      )}
      {renderPage()}
    </Box>
  );
}
