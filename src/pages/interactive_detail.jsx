import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Grid,
  GridItem,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { getDocumentById } from "../services/interactive";

export default function InteractiveDetail({ result, setPage }) {
  const resultData = result || {};
  const initialQueryVector = resultData.initial_query_vector || {};
  const expandedQueryVector = resultData.expanded_query_vector || {};
  const initialResults = resultData.initial_results || [];
  const expandedResults = resultData.expanded_results || [];

  const allWordsSet = new Set([
    ...Object.keys(initialQueryVector),
    ...Object.keys(expandedQueryVector),
  ]);
  const words = Array.from(allWordsSet);
  const initialWeights = words.map((word) => initialQueryVector[word] ?? 0);
  const expandedWeights = words.map((word) => expandedQueryVector[word] ?? 0);

  const [paginationPage, setPaginationPage] = useState(1);
  const [sortMode, setSortMode] = useState("expanded");
  
  useEffect(() => {
    setPaginationPage(1);
  }, [sortMode]);

  const scrollRef = useRef(null);
  const pageSize = 10;
  const [docDetails, setDocDetails] = useState({});

  const resultMap = {};
  for (const r of initialResults) {
    resultMap[r.doc_id] = {
      doc_id: r.doc_id,
      initial_rank: r.rank,
      initial_score: r.score,
    };
  }
  for (const r of expandedResults) {
    if (!resultMap[r.doc_id]) resultMap[r.doc_id] = { doc_id: r.doc_id };
    resultMap[r.doc_id].expanded_rank = r.rank;
    resultMap[r.doc_id].expanded_score = r.score;
  }

  const resultsSorted = Object.values(resultMap).sort((a, b) => {
    const key = sortMode === "initial" ? "initial_rank" : "expanded_rank";
    return (a[key] ?? Infinity) - (b[key] ?? Infinity);
  });

  const totalDocs = resultsSorted.length;
  const pageCount = Math.ceil(totalDocs / pageSize);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [paginationPage]);

  useEffect(() => {
    const fetchDetails = async () => {
      const sliced = resultsSorted.slice(
        (paginationPage - 1) * pageSize,
        paginationPage * pageSize
      );
      const promises = sliced.map((item) => getDocumentById(item.doc_id));
      const responses = await Promise.all(promises);
      const detailsMap = {};
      responses.forEach((res) => {
        if (res?.data?.id_doc) {
          detailsMap[res.data.id_doc] = res.data;
        }
      });
      setDocDetails(detailsMap);
    };
    fetchDetails();
  }, [paginationPage, sortMode]);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const generatePageNumbers = () => {
      const pages = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, "...", totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages
          );
        }
      }

      return pages;
    };

    const pageItems = generatePageNumbers();

    return (
      <Flex mt={4} justify="center" align="center" gap={1}>
        <Button
          size="sm"
          variant="ghost"
          isDisabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          ←
        </Button>

        {pageItems.map((p, idx) =>
          p === "..." ? (
            <Box key={`ellipsis-${idx}`} px={2} py={1} fontSize="sm" color="gray.500">
              ...
            </Box>
          ) : (
            <Button
              key={`page-${p}`}
              size="sm"
              variant={p === currentPage ? "outline" : "ghost"}
              borderColor={p === currentPage ? "orange.400" : "transparent"}
              borderWidth={p === currentPage ? "1px" : "0"}
              color={p === currentPage ? "orange.600" : "gray.700"}
              onClick={() => onPageChange(p)}
              _hover={{ bg: "gray.100" }}
            >
              {p}
            </Button>
          )
        )}

        <Button
          size="sm"
          variant="ghost"
          isDisabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          →
        </Button>
      </Flex>
    );
  };

  const renderTable = () => (
    <Flex
      justify="space-between"
      align="center"
      px={4}
      pb={4}
      w="100%"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <VStack spacing={0} align="stretch" justify="center" minW="150px" flexShrink={0}>
        {["Expanded Query", "Initial Weight", "Expanded Weight"].map((label, i) => (
          <Box
            key={i}
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Text whiteSpace="nowrap" fontWeight="bold" fontSize="md">{label}</Text>
          </Box>
        ))}
      </VStack>

      <Box flex="1" overflowX="auto">
        <Box minW="fit-content">
          <Grid templateColumns={`repeat(${words.length}, auto)`} width="max-content" height="120px">
            {words.map((word, i) => (
              <GridItem key={`word-${i}`} border="1px solid" borderColor="gray.300" h="40px" px={2} display="flex" alignItems="center" justifyContent="center">
                <Text whiteSpace="nowrap" fontSize="xs">{word}</Text>
              </GridItem>
            ))}
            {initialWeights.map((w, i) => (
              <GridItem key={`iw-${i}`} border="1px solid" borderColor="gray.300" h="40px" px={2} display="flex" alignItems="center" justifyContent="center" fontSize="xs">
                {w.toFixed(3)}
              </GridItem>
            ))}
            {expandedWeights.map((w, i) => (
              <GridItem key={`ew-${i}`} border="1px solid" borderColor="gray.300" h="40px" px={2} display="flex" alignItems="center" justifyContent="center" fontSize="xs">
                {w.toFixed(3)}
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>

      <Flex ml={4} direction="column" alignItems="center" gap={2} height="120px" justifyContent="center" flexShrink={0}>
        <Text textAlign="center" fontSize="md">Sort By Rank</Text>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} bg="orange.400" color="white" _hover={{ bg: "orange.500" }} _expanded={{ bg: "orange.500" }} borderRadius="lg" minW="120px" textAlign="center" fontWeight="bold" fontSize="sm">
            {sortMode === "initial" ? "Initial" : "Expanded"}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setSortMode("initial")}>Initial</MenuItem>
            <MenuItem onClick={() => setSortMode("expanded")}>Expanded</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );

  const renderCard = (item, index) => {
    const doc = docDetails[item.doc_id] || {};
    return (
      <Flex key={index} p={4} justify="space-between" align="center" w="full">
        <Box
          minW="60px"
          minH="80px"
          bg="gray.100"
          borderRadius="md"
          mr={4}
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="sm" fontWeight="bold" color="gray.600">
            ID
          </Text>
          <Text fontSize="md" fontWeight="bold" color="orange.600">
            {item.doc_id}
          </Text>
        </Box>

        <Box flex="1" pr={4} maxW={800}>
          <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            <Text fontWeight="bold" fontSize="md" color="blue.600" isTruncated>
              {doc.title || `Document ID: ${item.doc_id}`}
            </Text>
          </Box>
          {doc.author && (
            <Text fontSize="sm" fontStyle="italic" color="gray.500" mb={1} isTruncated>
              by {doc.author}
            </Text>
          )}
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {doc.content || "No snippet available."}
          </Text>
        </Box>

        <Grid
          templateColumns="60px repeat(2, 60px)"
          templateRows="repeat(3, auto)"
          gap={2}
          alignItems="center"
          justifyItems="center"
        >
          <Box />
          <Text fontWeight="bold" fontSize="sm">Awal</Text>
          <Text fontWeight="bold" fontSize="sm">Akhir</Text>
          <Text fontWeight="bold" fontSize="sm">Rank</Text>
          <Input size="sm" bg="orange.50" w="60px" h="30px" value={item.initial_rank ?? "-"} readOnly />
          <Input size="sm" bg="orange.50" w="60px" h="30px" value={item.expanded_rank ?? "-"} readOnly />
          <Text fontWeight="bold" fontSize="sm">Score</Text>
          <Input size="sm" bg="orange.50" w="60px" h="30px" value={item.initial_score?.toFixed(3) ?? "-"} readOnly />
          <Input size="sm" bg="orange.50" w="60px" h="30px" value={item.expanded_score?.toFixed(3) ?? "-"} readOnly />
        </Grid>
      </Flex>
    );
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const sliced = resultsSorted.slice(
        (paginationPage - 1) * pageSize,
        paginationPage * pageSize
      );
      const promises = sliced.map((item) => getDocumentById(item.doc_id));
      const responses = await Promise.all(promises);

      const detailsMap = {};
      responses.forEach((res, idx) => {
        const docData = res?.data;
        if (docData?.id_doc) {
          detailsMap[sliced[idx].doc_id] = docData;
        } else {
        }
      });

      setDocDetails(detailsMap);
    };

    fetchDetails();
  }, [paginationPage, sortMode]);

  return (
    <VStack spacing={0} align="stretch">
      <Box>
        <Button
          leftIcon={<ChevronLeftIcon />}
          variant="ghost"
          color="black"
          fontSize="sm"
          fontWeight="normal"
          _hover={{ bg: 'transparent', textDecoration: 'underline' }}
          onClick={() => setPage("interactive")}
          px={2}
        >
          Back to Search
        </Button>
      </Box>
      <Box px={16}>{renderTable()}</Box>
      <Box ref={scrollRef} maxHeight="calc(100vh - 312px)" overflowY="auto">
        <VStack spacing={0}>
          {resultsSorted
            .slice((paginationPage - 1) * pageSize, paginationPage * pageSize)
            .map((item, i) => (
              <Box key={i} px={16} w="full">
                {renderCard(item, i)}
              </Box>
            ))}
          <Box px={16} w="full">
            <Pagination currentPage={paginationPage} totalPages={pageCount} onPageChange={setPaginationPage} />
          </Box>
        </VStack>
      </Box>
    </VStack>
  );
}
