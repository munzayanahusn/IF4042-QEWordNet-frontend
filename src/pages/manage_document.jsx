import React, { useState } from 'react';
import '@fontsource/poppins';
import {
  Box,
  Flex,
  Text,
  Select,
  Button,
  Heading,
  useToast,
  Switch,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { ArrowUpIcon } from '@chakra-ui/icons';

export default function ManageDocument() {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [stemming, setStemming] = useState(true);
  const [stopWord, setStopWord] = useState(true);
  const toast = useToast();

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      toast({
        title: 'Upload complete',
        description: `Document ${selectedDoc || 'untitled'} uploaded.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsUploading(false);
    }, 2000);
  };

  const invertedFileData = Array.from({ length: 60 }, (_, i) => ({
    term: `Term${i + 1}`,
    document: `D${(i % 5) + 1}`,
    raw: Math.random().toFixed(2),
    logarithmic: Math.random().toFixed(2),
    binary: Math.random().toFixed(2),
    augmented: Math.random().toFixed(2),
    idf: Math.random().toFixed(2),
  }));

  return (
    <Box w="100%" px={16} pt={8} bg="white" fontFamily="'Poppins', sans-serif">
      <Flex mb={8} align="center" gap={4}>
        <Text fontWeight="bold" fontSize="lg" minW="100px">Document</Text>
        <Flex flex="1" gap={3} align="center">
          <Select
            placeholder="No document selected"
            value={selectedDoc}
            onChange={e => setSelectedDoc(e.target.value)}
            bg="gray.100"
            border="none"
            borderRadius="md"
            fontSize="sm"
            height="8"
            flex="1"
            boxShadow="sm"
            _focus={{ boxShadow: 'outline' }}
          >
            <option value="report1.pdf">Report 1</option>
            <option value="draft2.docx">Draft 2</option>
          </Select>
          <Button
            onClick={handleUpload}
            leftIcon={<ArrowUpIcon />}
            isLoading={isUploading}
            size="lg"
            height="8"
            bg="orange.400"
            _hover={{ bg: 'orange.500' }}
            color="white"
            borderRadius="md"
            boxShadow="lg"
            fontSize="sm"
          >
            Upload
          </Button>
        </Flex>
      </Flex>
      <Flex justify="space-between" align="center" mb={3}>
        <Heading fontSize="lg" fontWeight="bold">Inverted File</Heading>
        <HStack spacing={8}>
          <HStack>
            <Text fontSize="sm">Stemming</Text>
            <Switch size="sm" isChecked={stemming} onChange={() => setStemming(!stemming)} colorScheme="orange" />
          </HStack>
          <HStack>
            <Text fontSize="sm">Stop Word</Text>
            <Switch size="sm" isChecked={stopWord} onChange={() => setStopWord(!stopWord)} colorScheme="orange" />
          </HStack>
        </HStack>
      </Flex>
      <Box borderRadius="md" overflow="hidden">
        <TableContainer maxH="calc(100vh - 150px)" overflowY="auto" overflowX="auto">
          <Table variant="simple" size="sm" tableLayout="fixed" w="100%">
            <colgroup>
              <col width="14.28%" />
              <col width="14.28%" />
              <col width="14.28%" />
              <col width="14.28%" />
              <col width="14.28%" />
              <col width="14.28%" />
              <col width="14.28%" />
            </colgroup>
            <Thead position="sticky" top={0} bg="white" zIndex="docked">
              <Tr>
                <Th rowSpan={2} px={4} py={2} textAlign="center" borderBottomWidth="1px">Term</Th>
                <Th rowSpan={2} px={4} py={2} textAlign="center" borderBottomWidth="1px">Document</Th>
                <Th colSpan={4} px={4} py={2} pr={4} textAlign="center" borderBottomWidth="0">Term-Frequency</Th>
                <Th rowSpan={2} px={4} py={2} ml={4} textAlign="center" borderBottomWidth="1px">IDF</Th>
              </Tr>
              <Tr>
                <Th px={4} py={2} textAlign="center" borderBottomWidth="1px">Raw</Th>
                <Th px={4} py={2} textAlign="center" borderBottomWidth="1px">Logarithmic</Th>
                <Th px={4} py={2} textAlign="center" borderBottomWidth="1px">Binary</Th>
                <Th px={4} py={2} textAlign="center" borderBottomWidth="1px">Augmented</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invertedFileData.map((row, i) => (
                <Tr key={i} _hover={{ bg: 'gray.50' }}>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.term}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.document}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.raw}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.logarithmic}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.binary}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.augmented}</Td>
                  <Td px={4} py={2} textAlign="center" borderBottomWidth="1px">{row.idf}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}