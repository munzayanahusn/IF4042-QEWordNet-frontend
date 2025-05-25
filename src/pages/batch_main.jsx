import { useRef, useState, useEffect } from "react";
import { searchDocumentBatch } from "../services/batch";
import { getDCID } from "../services/interactive";
import { FaUpload } from "react-icons/fa";
import logo1 from "../assets/logo1-new.svg";
import { Search2Icon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Select,
  Text,
  VStack,
  useToast,
  Image,
  Spinner
} from "@chakra-ui/react";


const UploadCard = ({ id, file, onFileChange, onRemove }) => {
  const inputRef = useRef();

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    onFileChange(e);
    // Reset input so the same file can be selected again later
    e.target.value = null;
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove();
    // Reset input manually
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  return (
    <Box
      border="2px dashed orange"
      w="250px"
      h="200px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="#fafefe"
      borderRadius="md"
      cursor="pointer"
      _hover={{ bg: "#fdf8f4" }}
      onClick={handleClick}
    >
      <Input
        id={id}
        type="file"
        accept=".txt,.text"
        display="none"
        ref={inputRef}
        onChange={handleInputChange}
      />

      {file ? (
        <VStack spacing={2} pointerEvents="none">
          <Text fontWeight="bold" color="teal.800" textAlign="center">{file.name}</Text>
          <Text fontSize="sm" color="gray.500">(click to change)</Text>
          <Button
            size="xs"
            colorScheme="red"
            variant="ghost"
            onClick={handleRemove}
            pointerEvents="auto"
          >
            Remove
          </Button>
        </VStack>
      ) : (
        <VStack spacing={2}>
          <Icon as={FaUpload} color="orange.400" boxSize={6} />
          <Text fontWeight="medium" color="orange.500">Upload Files</Text>
          <Text fontSize="sm">Supported formats: Txt</Text>
        </VStack>
      )}
    </Box>
  );
};


export default function BatchMain({ setMainNavbar }) {
  const [queriesFile, setQueriesFile] = useState(null);
  const [relevantFile, setRelevantFile] = useState(null);
  const [settingsFile, setSettingsFile] = useState(null);
  const [outputFileName, setOutputFileName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [selectedDC, setSelectedDC] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();

  const fetchDocumentIDs = async () => {
    try {
      const response = await getDCID();
      if (response.status === 200) {
        console.log('Document IDs fetched successfully:', response.data);
        setDocuments(response.data.map(item => ({
          id: item.id,
          filename: item.dc_path.split(/[/\\]/).pop().split('_').pop()
        })));      } else {
        console.error('Error fetching document IDs:', response.statusText);
      }
    }
    catch (error) {
      console.error('Error fetching document IDs:', error);
    }
  };

  const searchBatch = async () => {
    if (!outputFileName.trim()) {
      toast({
        title: "File name cannot be empty",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (!queriesFile || !relevantFile || !settingsFile) {
      toast({
        title: "All files must be uploaded",
        status: "error",
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('dc_id', selectedDC);
    formData.append('queries', queriesFile);
    formData.append('relevance', relevantFile);
    formData.append('settings', settingsFile);
    formData.append('filename', outputFileName);
    formData.append('download', false);

    try {
      setMainNavbar(false);
      const response = await searchDocumentBatch(formData);

      if (response.status === 200) {
        toast({
          title: "Files uploaded successfully",
          status: "success",
          isClosable: true,
        });
        console.log(response.data);

        // Convert the query results to plain text
        const textContent = response.data.query_results.map((item, idx) => {
          return `Query ${idx + 1} (${item.query_id}):\n` +
                `Initial Query:\n${item.initial_query}\n\n` +
                `Expanded Query:\n${item.expanded_query}\n\n` +
                `Initial AP: ${item.initial_ap}\n` +
                `Expanded AP: ${item.expanded_ap}\n` +
                `----------------------------------------\n`;
        }).join('\n');

        // Create a blob and generate a download link
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${outputFileName || 'output'}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      else {
        toast({
          title: "Upload failed",
          description: response.statusText,
          status: "error",
          isClosable: true,
        });
      }

    } catch (error) {
      toast({
        title: "Upload failed",
        description: error.message,
        status: "error",
        isClosable: true,
      });
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentIDs();
  }, []);

  return (
    <VStack spacing={8} p={6}>
      <Heading fontSize="4xl" color="teal.900">
        <Flex direction="column" align="center" gap={6}>
          <Image src={logo1} alt="Logo" height={"56"} mb={5}/>
        </Flex>
      </Heading>

      <Flex align="center" gap={4} w="100%" maxW="700px">
        <Text w="100px">Document</Text>
        <Select
          flex={1}
          placeholder="No document collection selected"
          isReadOnly
          bg="#DCE2EE"
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

      <Flex gap={8} wrap="wrap" justify="center">
        <VStack>
          <Text fontWeight="semibold">Queries</Text>
          <UploadCard
            id="queries-upload"
            file={queriesFile}
            onFileChange={(e) => setQueriesFile(e.target.files[0])}
            onRemove={() => setQueriesFile(null)}
          />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Relevant Judgement</Text>
          <UploadCard
            id="relevant-upload"
            file={relevantFile}
            onFileChange={(e) => setRelevantFile(e.target.files[0])}
            onRemove={() => setRelevantFile(null)}
          />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Settings</Text>
          <UploadCard
            id="settings-upload"
            file={settingsFile}
            onFileChange={(e) => setSettingsFile(e.target.files[0])}
            onRemove={() => setSettingsFile(null)}
          />
        </VStack>
      </Flex>

      <Flex w="100%" maxW="700px" gap={4} justify="center" align="center">
        <Text w="220px">Output File Name</Text>

        <Input
          isDisabled={isLoading}
          placeholder="Input file name"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              searchBatch();
            }
          }}
        />
        <Button gap={2} onClick={searchBatch} bg="#fbe2c3" shadow="md" p={"1"} w="200px" _hover={{ bg: '#f9d6a0' }} isDisabled={isLoading}>
          <Search2Icon />
          Search
        </Button>
      </Flex>

      {/* Loading */}
      {isLoading && (
        <Flex
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="rgba(255,255,255,0.7)"
          justify="center"
          align="center"
          zIndex={9999}
        >
          <Box textAlign="center">
            <Spinner size="xl" thickness="4px" color="purple.500" />
            <Text mt={4} fontWeight="medium" color="gray.700">Searching...</Text>
          </Box>
        </Flex>
      )}
    </VStack>
  );
};
