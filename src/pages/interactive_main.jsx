import {
  Image,
  Box,
  Flex,
  Text,
  Button,
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
import { FaCloudUploadAlt } from 'react-icons/fa';
import { useState } from "react";
import logo1 from "../assets/logo1.svg";


export default function InteractiveMain({ setMainNavbar }) {
  const [stemming, setStemming] = useState(true);
  const [stopWord, setStopWord] = useState(true);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
          />
          <InputRightElement>
              <IconButton
              icon={<Search2Icon />}
              aria-label="Search"
              variant="ghost"
              size="sm"
              borderRadius="full"
              _hover={{ bg: "gray.100" }}
              _active={{ bg: "gray.200" }}
              onClick={() => setMainNavbar(false)}
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
                bg="orange.400"
                color="white"
                defaultValue="Raw-TF"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Raw-TF">Raw-TF</option>
                <option style={{ color: "black" }} value="Logarithmic-TF">Logarithmic-TF</option>
                <option style={{ color: "black" }} value="Binary-TF">Binary-TF</option>
                <option style={{ color: "black" }} value="Augmented-TF">Augmented-TF</option>

              </Select>
              <Select
                w="150px"
                h="45px"
                bg="orange.400"
                color="white"
                defaultValue="Raw-TF"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Raw-TF">Raw-TF</option>
                <option style={{ color: "black" }} value="Logarithmic-TF">Logarithmic-TF</option>
                <option style={{ color: "black" }} value="Binary-TF">Binary-TF</option>
                <option style={{ color: "black" }} value="Augmented-TF">Augmented-TF</option>
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
                bg="orange.400"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Yes">Yes</option>
                <option style={{ color: "black" }} value="No">No</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="orange.400"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Yes">Yes</option>
                <option style={{ color: "black" }} value="No">No</option>
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
                bg="orange.400"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Yes">Yes</option>
                <option style={{ color: "black" }} value="No">No</option>
              </Select>
              <Select
                w="150px"
                h="45px"
                bg="orange.400"
                color="white"
                defaultValue="Yes"
                borderRadius="12px"
                boxShadow="md"
              >
                <option style={{ color: "black" }} value="Yes">Yes</option>
                <option style={{ color: "black" }} value="No">No</option>
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
                w="250px"
                h="50px"
                bg="gray.200"
                borderRadius="12px"
                boxShadow="md"
              >
                <option value="doc1.txt">doc1.txt</option>
                <option value="doc2.txt">doc2.txt</option>
              </Select>
          </Flex>

          <Button
            alignSelf={"flex-end"}
            leftIcon={<FaCloudUploadAlt />}
            h="50px"
            px={6}
            bg="orange.400"
            color="white"
            borderRadius="12px"
            boxShadow="md"
            _hover={{ bg: "orange.500" }}
          >
            Upload
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
}
