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
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import logo1 from "../assets/logo1.svg";
import { getDCID, searchDocument } from "../services/interactive"

export default function InteractiveMain({ setMainNavbar }) {
  const [query, setQuery] = useState('');
  const [stemming, setStemming] = useState(false);
  const [stopWord, setStopWord] = useState(false);
  const [synset, setSynset] = useState(["lemmas"]);
  const [queryTF, setQueryTF] = useState("raw");
  const [queryIDF, setQueryIDF] = useState(true);
  const [queryNorm, setQueryNorm] = useState(true);
  const [docTF, setDocTF] = useState("raw");
  const [docIDF, setDocIDF] = useState(true);
  const [docNorm, setDocNorm] = useState(true);
  const [documentIDs, setDocumentIDs] = useState([]);
  const [selectedDC, setSelectedDC] = useState("");

  const fetchDocumentIDs = async () => {
    try {
      const response = await getDCID();
      if (response.status === 200) {
        console.log('Document IDs fetched successfully:', response.data);
        setDocumentIDs(response.data.map(item => item.id));
      } else {
        console.error('Error fetching document IDs:', response.statusText);
      }
      // Handle the response data as needed
    }
    catch (error) {
      console.error('Error fetching document IDs:', error);
    }
  };

  const search = async () => {
    try {
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
      // Redirect to interactive_detail
      setMainNavbar(false)
      if (response.status === 200) {
        console.log('Users fetched successfully:', response.data);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
      // Handle the response data as needed
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  useEffect(() => {
    fetchDocumentIDs();
  }, []);
  
  useEffect(() => {
    console.log("Document IDs:", documentIDs);
  }, [documentIDs]);

  return (
    <Box minH="100vh" bg="white" px={8} mt={20} mb={12}>
      {/* Logo & Title */}
      <Flex direction="column" align="center" gap={6}>
        <Image src={logo1} alt="Logo" mb={5}/>

        {/* Search Box */}
        <InputGroup w="2xl">
          <Input
            placeholder="Input query"
            borderRadius="full"
            bg="white"
            boxShadow="sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <InputRightElement>
            <IconButton
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

        {/* Configuration Section */}
        <VStack mt={10} justify="center" gap={7} wrap="wrap" >
          <Flex justify="flex-end" gap={24} w={"full"} pr={9}>
            <Text fontSize="lg" fontWeight="medium">Query</Text>
            <Text fontSize="lg" fontWeight="medium">Document</Text>
          </Flex>

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
                defaultValue="Raw-TF"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setQueryTF(e.target.value)}
              >
                <option style={{ color: "black" }} value="raw">Raw-TF</option>
                <option style={{ color: "black" }} value="log">Logarithmic-TF</option>
                <option style={{ color: "black" }} value="binary">Binary-TF</option>
                <option style={{ color: "black" }} value="augmented">Augmented-TF</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="#F48C06"
                color="white"
                defaultValue="Raw-TF"
                borderRadius="12px"
                boxShadow="md"
                cursor="pointer"
                onChange={(e) => setDocTF(e.target.value)}
              >
                <option style={{ color: "black" }} value="raw">Raw-TF</option>
                <option style={{ color: "black" }} value="log">Logarithmic-TF</option>
                <option style={{ color: "black" }} value="binary">Binary-TF</option>
                <option style={{ color: "black" }} value="augmented">Augmented-TF</option>
              </Select>
            </HStack>
          </Flex>
          
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

          {/* Upload Section */}
          <Flex gap={10} align="center" justify="space-between" width="100%" maxW="600px">
            {/* Left side text */}
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
              {documentIDs.map((item) => (
                <option key={item} value={item}>
                  {`Document collection ${item}`}
                </option>
              ))}
            </Select>
          </Flex>
        </VStack>
      </Flex>
    </Box>
  );
}
