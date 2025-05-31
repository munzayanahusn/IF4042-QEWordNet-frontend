import { useState, useEffect, useRef } from "react";
import { getDCID, searchDocument } from "../services/interactive"
import logo1 from "../assets/logo1-new.svg";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Image,
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
  Select,
  VStack,
  HStack,
  Checkbox,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  Spinner
} from "@chakra-ui/react";


export default function InteractiveMain({ setMainNavbar, setSearchResult, setPage }) {
  // Query
  const [query, setQuery] = useState('');
  // Stemming and Stop Word options
  const [stemming, setStemming] = useState(false);
  const [stopWord, setStopWord] = useState(false);
  // Synset options
  const [synsets, setSynsets] = useState(true)
  const [lemmas, setLemmas] = useState(false);
  const [hyponyms, setHyponyms] = useState(false);
  const [hypernyms, setHypernyms] = useState(false);
  const [alsoSees, setAlsoSees] = useState(false);
  const [similarTos, setSimilarTos] = useState(false);
  const [verbGroups, setVerbGroups] = useState(false);
  // Query Configuration
  const [queryTF, setQueryTF] = useState("raw");
  const [queryIDF, setQueryIDF] = useState(true);
  const [queryNorm, setQueryNorm] = useState(true);
  // Document Configuration
  const [docTF, setDocTF] = useState("raw");
  const [docIDF, setDocIDF] = useState(true);
  const [docNorm, setDocNorm] = useState(true);
  // Document Collections
  const [documents, setDocuments] = useState([]);
  const [selectedDC, setSelectedDC] = useState("");
  // Others
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  const fetchDocuments = async () => {
    try {
      const response = await getDCID();
      if (response.status === 200) {
        console.log('Document IDs fetched successfully:', response.data);
        setDocuments(response.data.map(item => ({
          id: item.id,
          filename: item.dc_path.split(/[/\\]/).pop().split('_').pop()
        })));
      } else {
        console.error('Error fetching documents:', response.statusText);
      }
    }
    catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const search = async () => {
    if (!query) {
      setErrorText("Please input a query");
      onOpen();
      return;
    }
    if (!selectedDC) {
      setErrorText("Please select a document collection");
      onOpen();
      return;
    }
    if (isLoading) return;

    try {
      setIsLoading(true);

      let synset = [];
      if (synsets) synset.push("synset")
      if (lemmas) synset.push("lemma");
      if (hyponyms) synset.push("hyponym");
      if (hypernyms) synset.push("hypernym");
      if (alsoSees) synset.push("also_see");
      if (similarTos) synset.push("similar_to");
      if (verbGroups) synset.push("verb_group");

      let data = {
        dc_id: selectedDC,
        query: query,
        synset: synset,
        stem: stemming,
        stopword: stopWord,
        query_tf: queryTF,
        query_idf: queryIDF,
        query_norm: queryNorm,
        doc_tf: docTF,
        doc_idf: docIDF,
        doc_norm: docNorm
      };
      console.log("Search Data:", data);
      const response = await searchDocument(data);

      if (response.status === 200) {
        console.log('Search results:', response.data);
        setMainNavbar(false);
        setSearchResult(response.data);
        setPage("interactive_result");
      } else {
        onOpen();
        setErrorText(`Error: ${response.statusText}`);
        console.error('Error fetching search:', response);
      }
    } catch (error) {
      onOpen();
      setErrorText(`Error: ${error.message}`);
      console.error('Error during search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  return (
    <Box p={6} mb={10}>
      <Flex direction="column" align="center" gap={6}>
        {/* Logo & Title */}
        <Image src={logo1} alt="Logo" height={"56"} mb={5}/>

        {/* Search Box */}
        <InputGroup w="2xl">
          <Input
            isDisabled={isLoading}
            placeholder="Input query"
            borderRadius="full"
            bg="white"
            boxShadow="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                search();
              }
            }}
          />
          <InputRightElement>
            <IconButton
              isDisabled={isLoading}
              icon={<Search2Icon />}
              aria-label="Search"
              variant="ghost"
              size="sm"
              borderRadius="full"
              _hover={{ bg: 'gray.100' }}
              _active={{ bg: 'gray.200' }}
              onClick={search}
            />
          </InputRightElement>
        </InputGroup>

        {/* Synset Options */}
        <HStack mt={6} spacing={8}>
          <Checkbox
            isChecked={synsets}
            onChange={(e) => setSynsets(e.target.checked)}
            colorScheme="purple"
          >
            Synset
          </Checkbox>
          <Checkbox
            isChecked={lemmas}
            onChange={(e) => setLemmas(e.target.checked)}
            colorScheme="purple"
          >
            Lemma
          </Checkbox>
          <Checkbox
            isChecked={hyponyms}
            onChange={(e) => setHyponyms(e.target.checked)}
            colorScheme="purple"
          >
            Hyponym
          </Checkbox>
          <Checkbox
            isChecked={hypernyms}
            onChange={(e) => setHypernyms(e.target.checked)}
            colorScheme="purple"
          >
            Hypernym
          </Checkbox>
          <Checkbox
            isChecked={alsoSees}
            onChange={(e) => setAlsoSees(e.target.checked)}
            colorScheme="purple"
          >
            Also See
          </Checkbox>
          <Checkbox
            isChecked={similarTos}
            onChange={(e) => setSimilarTos(e.target.checked)}
            colorScheme="purple"
          >
            Similar To
          </Checkbox>
          <Checkbox
            isChecked={verbGroups}
            onChange={(e) => setVerbGroups(e.target.checked)}
            colorScheme="purple"
          >
            Verb Group
          </Checkbox>
        </HStack>

        {/* Switches */}
        <HStack mt={6} spacing={8}>
          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0" fontSize="sm" whiteSpace="nowrap">
              Stemming
            </FormLabel>
            <Switch
              colorScheme="purple"
              isChecked={stemming}
              onChange={() => setStemming(!stemming)}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
              <FormLabel mb="0" fontSize="sm" whiteSpace="nowrap">
                Stop Word
              </FormLabel>
              <Switch
                colorScheme="purple"
                isChecked={stopWord}
                onChange={() => setStopWord(!stopWord)}
              />
          </FormControl>
        </HStack>

        {/* Query and document configurations */}
        <VStack mt={10} justify="center" gap={7} wrap="wrap" >
          <Flex justify="flex-end" gap={24} w={"full"} pr={9}>
            <Text fontSize="lg" fontWeight="medium">Query</Text>
            <Text fontSize="lg" fontWeight="medium">Document</Text>
          </Flex>

          {/* Term Frequency */}
          <Flex gap={10} align="center" justify="space-between" width="100%" maxW="600px">
            {/* Left side text */}
            <Text fontSize="lg" fontWeight="medium">
              Term Frequency
            </Text>
            {/* Right side buttons grouped */}
            <HStack spacing={4}>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="raw"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setQueryTF(e.target.value)}
              >
                <option style={{ color: "black" }} value="raw">Raw</option>
                <option style={{ color: "black" }} value="log">Logarithmic</option>
                <option style={{ color: "black" }} value="binary">Binary</option>
                <option style={{ color: "black" }} value="augmented">Augmented</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="raw"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setDocTF(e.target.value)}
              >
                <option style={{ color: "black" }} value="raw">Raw</option>
                <option style={{ color: "black" }} value="log">Logarithmic</option>
                <option style={{ color: "black" }} value="binary">Binary</option>
                <option style={{ color: "black" }} value="augmented">Augmented</option>
              </Select>
            </HStack>
          </Flex>
          
          {/* Inverse Document Frequency */}
          <Flex gap={10} align="center" justify="space-between" width="100%" maxW="600px">
            {/* Left side text */}
            <Text fontSize="lg" fontWeight="medium">
              Inverse Document Frequency
            </Text>
            {/* Right side buttons grouped */}
            <HStack spacing={4}>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setQueryIDF(e.target.value)}
              >
                <option style={{ color: "black" }} value={true}>Yes</option>
                <option style={{ color: "black" }} value={false}>No</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setDocIDF(e.target.value)}
              >
                <option style={{ color: "black" }} value={true}>Yes</option>
                <option style={{ color: "black" }} value={false}>No</option>
              </Select>
            </HStack>
          </Flex>

          {/* Normalization */}
          <Flex gap={10} align="center" justify="space-between" width="100%" maxW="600px" mb={5}>
            {/* Left side text */}
            <Text fontSize="lg" fontWeight="medium">
              Normalization
            </Text>
            {/* Right side buttons grouped */}
            <HStack spacing={4}>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setQueryNorm(e.target.value)}
              >
                <option style={{ color: "black" }} value={true}>Yes</option>
                <option style={{ color: "black" }} value={false}>No</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setDocNorm(e.target.value)}
              >
                <option style={{ color: "black" }} value={true}>Yes</option>
                <option style={{ color: "black" }} value={false}>No</option>
              </Select>
            </HStack>
          </Flex>

          {/* Document collection selection */}
          <Flex gap={10} align="center" justify="space-between" width="100%" maxW="600px">
            <Text fontSize="lg" fontWeight="medium">
              Document
            </Text>
            <Select
              placeholder="No document selected"
              w="310px"
              h="50px"
              bg="#DCE2EE"
              borderRadius="12px"
              boxShadow="md"
              cursor="pointer"
              value={selectedDC}
              onChange={(e) => setSelectedDC(e.target.value)}
            >
              {documents.map((item) => (
                <option key={item.id} value={item.id}>
                  {`ID ${item.id}: ${item.filename}`}
                </option>
              ))}
            </Select>
          </Flex>
        </VStack>
      </Flex>

      {/* Error Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Error
            </AlertDialogHeader>

            <AlertDialogBody>
              {errorText}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* Loading Spinner */}
      {isLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, 0.9)"
          justify="center"
          align="center"
          zIndex={9999}
        >
          <Box textAlign="center">
            <Spinner size="xl" thickness="4px" color="purple.500" />
            <Text mt={4} fontWeight="semibold" fontSize="xl" color="white">Searching...</Text>
          </Box>
        </Flex>
      )}
    </Box>
  );
}
