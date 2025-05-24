import React, { useState, useEffect, useRef } from 'react';
import {
  Box, 
  Flex, 
  Text, 
  Button, 
  Heading, 
  useToast, 
  Switch, 
  HStack,
  VStack,
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  TableContainer, 
  Divider, 
  Select,
  Input, 
  InputGroup, 
  InputLeftElement, 
  List, 
  ListItem,
  useDisclosure, 
  useOutsideClick, 
  Modal, 
  ModalOverlay, 
  ModalContent,
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton, 
  Spinner
} from '@chakra-ui/react';
import { ArrowUpIcon, ChevronLeftIcon, SearchIcon } from '@chakra-ui/icons';
import '@fontsource/poppins';
import {
  fetchCollections,
  fetchDocumentsByCollection,
  fetchInvertedFile,
  uploadFile
} from '../services/manage_document';

function CustomSelectWithSearch({ selectedDoc, setSelectedDoc, documents, isLoading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ref = useRef();

  useOutsideClick({
    ref: ref,
    handler: onClose,
  });

  const filteredDocs = documents.filter(doc => {
    const docName = typeof doc === 'string' ? doc : (doc.name || doc.filename || doc.title || String(doc));
    return docName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const displayValue = isOpen ? searchTerm : selectedDoc || 'No document selected';

  return (
    <Box position="relative" ref={ref} fontFamily="Poppins" width="100%">
      <InputGroup>
        <InputLeftElement pointerEvents="none" height="100%" alignItems="center">
          <SearchIcon color="gray.300" boxSize={4} />
        </InputLeftElement>
        <Input
          placeholder="No document selected"
          value={displayValue}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) onOpen();
          }}
          onClick={onOpen}
          bg="gray.100"
          border="none"
          borderRadius="md"
          fontSize="md"
          height="10"
          boxShadow="sm"
          _focus={{ boxShadow: 'outline' }}
          _placeholder={{ color: 'gray.500' }}
          isDisabled={isLoading || documents.length === 0}
        />
      </InputGroup>

      {isOpen && (
        <List
          position="absolute"
          width="100%"
          mt={2}
          bg="white"
          boxShadow="md"
          borderRadius="md"
          maxH="240px"
          overflowY="auto"
          zIndex="dropdown"
          border="1px solid"
          borderColor="gray.200"
        >
          {isLoading ? (
            <ListItem px={4} py={3} color="gray.500" fontSize="md">
              Loading documents...
            </ListItem>
          ) : filteredDocs.length > 0 ? (
            filteredDocs.map((doc, index) => {
              const docName = typeof doc === 'string' ? doc : (doc.name || doc.filename || doc.title || String(doc));
              return (
                <ListItem
                  key={index}
                  px={4}
                  py={3}
                  cursor="pointer"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => {
                    setSelectedDoc(docName);
                    setSearchTerm('');
                    onClose();
                  }}
                  fontSize="md"
                >
                  {docName}
                </ListItem>
              );
            })
          ) : (
            <ListItem px={4} py={3} color="gray.500" fontSize="md">
              {documents.length === 0 ? 'No documents in collection' : 'No documents found'}
            </ListItem>
          )}
        </List>
      )}
    </Box>
  );
}

export default function ManageDocument() {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [stemming, setStemming] = useState(false);
  const [stopWord, setStopWord] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [invertedFileData, setInvertedFileData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const toast = useToast();

  useEffect(() => {
  setHasSearched(false);
  setInvertedFileData([]);
}, [selectedCollection, selectedDoc, stemming, stopWord]);

  useEffect(() => {
    fetchCollections()
      .then(setCollections)
      .catch(err => console.error('Failed to fetch document collections:', err));
  }, []);

  const handleSearch = async () => {
    if (!selectedCollection || !selectedDoc) {
      toast({
        title: 'Incomplete Selection',
        description: 'Please select both document collection and document.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSearching(true);
    try {
      const data = await fetchInvertedFile({
        id_dc: selectedCollection,
        id_doc: selectedDoc,
        stem: stemming,
        stopword: stopWord,
      });
      setInvertedFileData(data);
      setHasSearched(true); 
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setHasSearched(false);
    } finally {
      setIsSearching(false);
    }
  };
  useEffect(() => {
    if (selectedCollection) {
      setIsLoadingDocs(true);
      setSelectedDoc('');
      setDocuments([]);
      fetchDocumentsByCollection(selectedCollection)
        .then(data => {
          console.log('Fetched documents:', data);
          const docNames = Array.isArray(data)
            ? data.map(doc => String(doc)) 
            : [];
          setDocuments(docNames);
        })
        .catch(err => {
          console.error('Failed to fetch documents:', err);
          toast({
            title: 'Error fetching documents',
            description: 'Failed to load documents from the selected collection',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          setDocuments([]);
        })
        .finally(() => setIsLoadingDocs(false));
    } else {
      setDocuments([]);
      setSelectedDoc('');
    }
  }, [selectedCollection, toast]);


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
  if (!selectedFile) {
    toast({
      title: 'No file selected',
      description: 'Please select a file to upload',
      status: 'warning',
      duration: 3000,
      isClosable: true,
    });
    return;
  }

  try {
    setIsUploading(true);
    await uploadFile(selectedFile);

    toast({
      title: 'Upload complete',
      description: `Document ${selectedFile.name} uploaded successfully.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    const refreshed = await fetchCollections();
    setCollections(refreshed);

    if (selectedCollection) {
      const docsData = await fetchDocumentsByCollection(selectedCollection);
      const docNames = Array.isArray(data)
        ? data.map(doc => String(doc)) 
        : [];
      setDocuments(docNames);
    }

    onClose();
    setSelectedFile(null);
  } catch (error) {
    toast({
      title: 'Upload error',
      description: error.message || 'Something went wrong',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setIsUploading(false);
  }
};

  const handleCollectionChange = (e) => {
    setSelectedCollection(e.target.value);
  };

  return (
    <Box w="100%" px={16} bg="white" fontFamily="'Poppins', sans-serif">

      <Flex mb={6} justify="flex-end">
        <Button
          onClick={onOpen}
          leftIcon={<ArrowUpIcon boxSize={5} />}
          size="md"
          height="10"
          px={8}
          bg="#FDEDD4"
          _hover={{ bg: 'orange.100' }}
          color="black"
          borderRadius="md"
          boxShadow="md"
          fontSize="md"
          minWidth="180px"
        >
          Upload
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Upload Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              direction="column"
              align="center"
              justify="center"
              border="2px dashed gray"
              borderRadius="md"
              p={6}
              cursor="pointer"
              _hover={{ borderColor: 'orange.400' }}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <ArrowUpIcon boxSize={8} color="orange.400" mb={3} />
              <Text fontWeight="medium" mb={1}>Click to browse files</Text>
              <Text fontSize="sm" color="gray.500">or drag and drop</Text>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileChange}
                display="none"
                accept=".txt, .all"
              />
            </Flex>
            {selectedFile && (
              <Box mt={4} p={3} bg="gray.50" borderRadius="md">
                <Text fontSize="sm">{selectedFile.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              isLoading={isUploading}
              onClick={handleUpload}
              isDisabled={!selectedFile}
            >
              Upload
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex mb={8} align="center" gap={4}>
        <Text fontWeight="bold" fontSize="lg" minW="120px">Document</Text>
        <Flex flex="1" gap={4} align="center">
          <Select
            placeholder="No collection document selected"
            value={selectedCollection}
            onChange={handleCollectionChange}
            bg="gray.100"
            border="none"
            borderRadius="md"
            fontSize="md"
            height="10"
            width="75%"
            boxShadow="sm"
            _focus={{ boxShadow: 'outline' }}
          >
            {collections.map((col) => (
              <option key={col.id} value={col.id}>
                {col.dc_path.split('\\').pop()}
              </option>
            ))}
          </Select>

          <Box flex="1" position="relative" zIndex={20} minWidth="280px">
            <CustomSelectWithSearch
              selectedDoc={selectedDoc}
              setSelectedDoc={setSelectedDoc}
              documents={documents}
              isLoading={isLoadingDocs}
            />
          </Box>
          <Button
            height="10"
            bg="orange.400"
            _hover={{ bg: 'orange.500' }}
            color="white"
            borderRadius="md"
            boxShadow="md"
            fontSize="md"
            px={6}
            isDisabled={!selectedCollection || !selectedDoc || isSearching}
            isLoading={isSearching}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Flex>
      </Flex>

      <Divider borderColor="gray.300" mb={8} />

      <Flex justify="space-between" align="center" mb={4}>
        <Heading fontSize="xl" fontWeight="bold">Inverted File</Heading>
        <HStack spacing={8}>
          <HStack>
            <Text fontSize="md">Stemming</Text>
            <Switch isChecked={stemming} onChange={() => setStemming(!stemming)} colorScheme="purple" />
          </HStack>
          <HStack>
            <Text fontSize="md">Stop Word</Text>
            <Switch isChecked={stopWord} onChange={() => setStopWord(!stopWord)} colorScheme="purple" />
          </HStack>
        </HStack>
      </Flex>

      <Box borderRadius="md" overflow="hidden">
        <TableContainer maxH="calc(100vh - 350px)" overflowY="auto" overflowX="auto">
      <Table variant="simple" size="md" w="100%">
        <colgroup>
          <col width="16%" />
          <col width="14%" />
          <col width="14%" />
          <col width="14%" />
          <col width="14%" />
          <col width="14%" />
        </colgroup>
        <Thead>
          <Tr>
            <Th
              rowSpan={2}
              bg="white"
              position="sticky"
              top={0}
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Term
            </Th>
            <Th
              colSpan={4}
              textAlign="center"
              bg="white"
              position="sticky"
              top={0}
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Term-Frequency
            </Th>
            <Th
              rowSpan={2}
              bg="white"
              position="sticky"
              top={0}
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              IDF
            </Th>
          </Tr>
          <Tr>
            <Th
              bg="white"
              position="sticky"
              top="38px"
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Raw
            </Th>
            <Th
              bg="white"
              position="sticky"
              top="38px"
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Logarithmic
            </Th>
            <Th
              bg="white"
              position="sticky"
              top="38px"
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Binary
            </Th>
            <Th
              bg="white"
              position="sticky"
              top="38px"
              zIndex="docked"
              fontWeight="bold"
              fontSize="md"
            >
              Augmented
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {isSearching ? (
            <Tr>
              <Td colSpan={6} textAlign="center" py={6}>
                <Flex direction="column" align="center" gap={2}>
                  <Spinner size="lg" color="orange.400" />
                  <Text color="gray.500" fontStyle="italic">
                    Searching document "{selectedDoc}"...
                  </Text>
                </Flex>
              </Td>
            </Tr>
          ) : hasSearched ? (
            invertedFileData.length > 0 ? (
              invertedFileData.map((row, i) => (
                <Tr key={i}>
                  <Td>{row.term}</Td>
                  <Td>{row.tf_raw}</Td>
                  <Td>{row.tf_log}</Td>
                  <Td>{row.tf_binary}</Td>
                  <Td>{row.tf_augmented}</Td>
                  <Td>{row.idf}</Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center" py={6} color="gray.500">
                  <VStack spacing={2}>
                    <Text as="i">
                      {stemming && stopWord
                        ? 'Stemming and stopword removal are active'
                        : stemming
                        ? 'Stemming is active'
                        : stopWord
                        ? 'Stopword removal is active'
                        : 'Stemming and stopword removal are inactive'}
                    </Text>
                    <Text as="i" fontWeight="bold">
                      {stemming || stopWord
                        ? `No valid terms remain in Document "${selectedDoc}" after preprocessing.`
                        : `No valid terms remain in Document ${selectedDoc}`}
                    </Text>
                  </VStack>
                </Td>
              </Tr>
            )
          ) : (
            <Tr>
              <Td colSpan={6} textAlign="center" py={6} color="gray.500" fontStyle="italic">
                {selectedCollection && selectedDoc ? (
                  'Ready to search. Click the "Search" button to view results.'
                ) : (
                  'No data available. Please select and search a document.'
                )}
              </Td>
            </Tr>
          )}
        </Tbody>
        </Table>

        </TableContainer>
      </Box>
    </Box>
  );
}