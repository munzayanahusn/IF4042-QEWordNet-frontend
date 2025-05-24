import React, { useRef, useState, useEffect } from "react";
import { searchDocumentBatch } from "../services/batch";
import { getDCID } from "../services/interactive";
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
  HStack,
  useToast,
  Image
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import logo1 from "../assets/logo1.svg";
import { Search2Icon } from "@chakra-ui/icons";


const UploadCard = ({ title, onFileChange, id }) => {
  const inputRef = useRef();

  return (
    <Box
      as="label"
      htmlFor={id}
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
      _hover={{ bg: '#fdf8f4' }}
    >
      <HStack>
        <Icon as={FaUpload} color="orange.400" boxSize={6} />
        <Text fontWeight="medium" color="orange.500">
          Upload Files
        </Text>
      </HStack>
      <Text fontSize="sm" mt={2}>
        Supported formats: Txt
      </Text>

      <Input
        id={id}
        type="file"
        accept=".txt, .text"
        display="none"
        ref={inputRef}
        onChange={onFileChange}
      />
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

  const handleSaveClick = async () => {
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
    }
  };

  useEffect(() => {
    fetchDocumentIDs();
  }, []);

  return (
    <VStack spacing={8} p={6}>
      <Heading fontSize="4xl" color="teal.900">
        <Flex direction="column" align="center" gap={6}>
          <Image src={logo1} alt="Logo" height={"44"} mb={5}/>
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
          <UploadCard id="queries-upload" onFileChange={(e) => setQueriesFile(e.target.files[0])} />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Relevant Judgement</Text>
          <UploadCard id="relevant-upload" onFileChange={(e) => setRelevantFile(e.target.files[0])} />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Settings</Text>
          <UploadCard id="settings-upload" onFileChange={(e) => setSettingsFile(e.target.files[0])} />
        </VStack>
      </Flex>

      <Flex w="100%" maxW="700px" gap={4} justify="center" align="center">
        <Text w="220px">Output File Name</Text>

        <Input
          placeholder="Input file name"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
        <Button gap={2} onClick={handleSaveClick} bg="#fbe2c3" shadow="md" p={"1"} w="200px" _hover={{ bg: '#f9d6a0' }}>
          <Search2Icon />
          Search
        </Button>
      </Flex>
    </VStack>
  );
};
