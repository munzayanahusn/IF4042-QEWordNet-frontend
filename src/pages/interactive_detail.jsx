import React, { useState, useRef, useEffect } from "react";
import "@fontsource/poppins";
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
import { ChevronDownIcon } from "@chakra-ui/icons";

const words = ["to", "do", "AutoCADaaaaaaaaaaaaaaaaaaaa", "Analysis", "Analysis"];
const initialWeights = [0.3, 0.4, 0.2, 0.5, 0.6];
const expandedWeights = [0.5, 0.6, 0.3, 0.7, 0.8];
const totalDocs = 25;
const pageSize = 10;

const InteractiveDetail = () => {
  const [page, setPage] = useState(1);
  const [sortMode, setSortMode] = useState("initial");

  const pageCount = Math.ceil(totalDocs / pageSize);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [page]);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
      const pages = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 3) pages.push(1, 2, 3, "...", totalPages);
        else if (currentPage >= totalPages - 2)
          pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        else pages.push(1, "...", currentPage, "...", totalPages);
      }

      return pages.map((p, index) =>
        p === "..." ? (
          <Box key={index} px={2} py={1} fontSize="sm" color="gray.500">
            ...
          </Box>
        ) : (
          <Button
            key={index}
            size="sm"
            variant={p === currentPage ? "outline" : "ghost"}
            borderColor={p === currentPage ? "purple.500" : "transparent"}
            borderWidth={p === currentPage ? "1px" : "0"}
            color={p === currentPage ? "purple.600" : "gray.700"}
            onClick={() => onPageChange(p)}
            _hover={{ bg: "gray.100" }}
          >
            {p}
          </Button>
        )
      );
    };

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
        {renderPageNumbers()}
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
    <Flex justify="space-between" align="center">
      <VStack spacing={0} align="stretch" justify="center" minW="200px" flexShrink={0}>
        {["Expanded Query", "Initial Weight", "Expanded Weight"].map((label, i) => (
          <Box key={i} h="40px" display="flex" alignItems="center" justifyContent="flex-start">
            <Text whiteSpace="nowrap" fontWeight="bold" fontSize="lg">
              {label}
            </Text>
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
                {w}
              </GridItem>
            ))}
            {expandedWeights.map((w, i) => (
              <GridItem key={`ew-${i}`} border="1px solid" borderColor="gray.300" h="40px" px={2} display="flex" alignItems="center" justifyContent="center" fontSize="xs">
                {w}
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Box>

      <Flex ml={4} direction="column" alignItems="center" gap={2} height="120px" justifyContent="center" flexShrink={0}>
        <Text textAlign="center" fontWeight="light" fontSize="md">
          Sort By Rank
        </Text>
        <Menu>
          <MenuButton
            key={sortMode}
            as={Button}
            rightIcon={<ChevronDownIcon />}
            bg="#F48C06"
            color="white"
            _hover={{ bg: "#e07c04" }}
            _expanded={{ bg: "#e07c04" }}
            borderRadius="lg"
            minW="120px"
            textAlign="center"
            fontWeight="light"
            fontSize="sm"
          >
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

  const renderCard = (index) => (
    <Flex key={index} p={4} mb={4} justify="space-between" align="center">
      <Box>
        <Text fontWeight="bold" fontSize="md" color="blue.600" mb={1} isTruncated>
          Hemendra Mali - Product Design Engineer - Freelancer.com
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          I am expert in 3D & 2D designing and Rendering. I have great experience in Analysis & modeling using AutoCAD and similar tools...
        </Text>
      </Box>

      <Grid templateColumns="60px repeat(2, 50px)" templateRows="repeat(3, auto)" gap={2} alignItems="center" justifyItems="center" ml={4}>
        <Box />
        <Text fontWeight="bold" fontSize="sm">Awal</Text>
        <Text fontWeight="bold" fontSize="sm">Akhir</Text>
        <Text fontWeight="bold" fontSize="sm">Rank</Text>
        <Input size="sm" bg="rgba(244, 140, 6, 0.14)" border="none" borderRadius="md" w="50px" h="30px" />
        <Input size="sm" bg="rgba(244, 140, 6, 0.14)" border="none" borderRadius="md" w="50px" h="30px" />
        <Text fontWeight="bold" fontSize="sm">Score</Text>
        <Input size="sm" bg="rgba(244, 140, 6, 0.14)" border="none" borderRadius="md" w="50px" h="30px" />
        <Input size="sm" bg="rgba(244, 140, 6, 0.14)" border="none" borderRadius="md" w="50px" h="30px" />
      </Grid>
    </Flex>
  );

    return (
    <Flex direction="column" px={16} py={8}>
      <Box>{renderTable()}</Box>

      <Box ref={scrollRef} mt={6} maxHeight="55vh" overflowY="auto">
        {[...Array(Math.min(pageSize, totalDocs - (page - 1) * pageSize)).keys()].map((i) =>
          renderCard(i + (page - 1) * pageSize)
        )}
        <Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} />
      </Box>
    </Flex>
  );
};

export default InteractiveDetail;
