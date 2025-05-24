import React, { useRef, useState } from "react";
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


const UploadCard = ({ title, onFileChange }) => {
  const inputRef = useRef();

  return (
    <Box
      as="label"
      htmlFor="file-upload"
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
        id="file-upload"
        type="file"
        accept=".txt"
        display="none"
        ref={inputRef}
        onChange={onFileChange}
      />
    </Box>
  );
};

export default function BatchMain({ setMainNavbar }) {
  const [documentFile, setDocumentFile] = useState(null);
  const [queriesFile, setQueriesFile] = useState(null);
  const [relevantFile, setRelevantFile] = useState(null);
  const [settingsFile, setSettingsFile] = useState(null);
  const [outputFileName, setOutputFileName] = useState("");
  const toast = useToast();

  const handleUploadClick = () => {
    if (!documentFile) {
      toast({
        title: "No document selected",
        status: "warning",
        isClosable: true,
      });
      return;
    }
    toast({
      title: "Document uploaded!",
      description: documentFile.name,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveClick = () => {
    if (!outputFileName.trim()) {
      toast({
        title: "File name cannot be empty",
        status: "error",
        isClosable: true,
      });
      return;
    }
    toast({
      title: `File '${outputFileName}' saved!`,
      status: "success",
      isClosable: true,
    });
  };

  return (
    <VStack spacing={8} p={8}>
      <Heading fontSize="4xl" color="teal.900">
        <Flex direction="column" align="center" gap={6}>
          <Image src={logo1} alt="Logo" mb={5}/>
        </Flex>
      </Heading>

      <Flex align="center" gap={4} w="100%" maxW="700px">
        <Text w="100px">Document</Text>
        <Select
          flex={1}
          placeholder={documentFile ? documentFile.name : "No document collection selected"}
          isReadOnly
          bg="#DCE2EE"
          cursor="pointer"
        />
      </Flex>

      <Flex gap={8} wrap="wrap" justify="center">
        <VStack>
          <Text fontWeight="semibold">Queries</Text>
          <UploadCard onFileChange={(e) => setQueriesFile(e.target.files[0])} />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Relevant Judgement</Text>
          <UploadCard onFileChange={(e) => setRelevantFile(e.target.files[0])} />
        </VStack>
        <VStack>
          <Text fontWeight="semibold">Settings</Text>
          <UploadCard onFileChange={(e) => setSettingsFile(e.target.files[0])} />
        </VStack>
      </Flex>

      <Flex w="100%" maxW="700px" gap={4} mt={8}>
        <Input
          placeholder="Input file name"
          value={outputFileName}
          onChange={(e) => setOutputFileName(e.target.value)}
        />
        <Button onClick={handleSaveClick} bg="#fbe2c3" shadow="md">
          Save File
        </Button>
      </Flex>
    </VStack>
  );
};
