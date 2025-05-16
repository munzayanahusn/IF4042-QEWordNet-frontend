import { Box, Flex, Text, Button } from "@chakra-ui/react";

export default function SubNavbar({ current, onChange }) {
  const tabItems = [
    { key: "interactive", label: "Interactive" },
    { key: "batch", label: "Batch" },
    { key: "manage", label: "Manage Document" },
  ];

  return (
    <Flex
      justify="space-between"
      align="center"
      px={8}
      py={4}
      bg="white"
      boxShadow="sm"
    >
      {/* Logo */}
      <Flex align="center" gap={2}>
        <Box w={6} h={6} bg="cyan.400" transform="rotate(45deg)" />
        <Text fontWeight="bold" fontSize="lg" color="gray.800">
          STBI WORDNET
        </Text>
      </Flex>

      {/* Navigation Tabs */}
      <Flex gap={6}>
        {tabItems.map((tab) => {
          const isActive = current === tab.key;
          return (
            <Button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              variant="unstyled"
              fontWeight={isActive ? "medium" : "normal"}
              bg={isActive ? "orange.50" : "transparent"}
              color={isActive ? "gray.800" : "gray.600"}
              px={6}
              py={2}
              borderRadius="full"
              boxShadow={isActive ? "md" : "none"}
              _hover={{ bg: isActive ? "orange.100" : "gray.50" }}
            >
              {tab.label}
            </Button>
          );
        })}
      </Flex>
    </Flex>
  );
}
