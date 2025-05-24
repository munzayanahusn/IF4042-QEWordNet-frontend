import { HStack, Button } from "@chakra-ui/react";


export default function Navbar({ current, onChange }) {
  return (
    <HStack justify="center" spacing={16} pt={12} pb={6}>
      <Button
        onClick={() => onChange("interactive")}
        bg={current === "interactive" ? "#FDEDD4" : "transparent"}
        boxShadow={current === "interactive" ? "md" : "none"}
        borderRadius="20px"
        fontWeight="medium"
      >
        Interactive
      </Button>

      <Button
        onClick={() => onChange("batch")}
        bg={current === "batch" ? "#FDEDD4" : "transparent"}
        boxShadow={current === "batch" ? "md" : "none"}
        borderRadius="20px"
        fontWeight="medium"
      >
        Batch
      </Button>

      <Button
        onClick={() => onChange("manage")}
        bg={current === "manage" ? "#FDEDD4" : "transparent"}
        boxShadow={current === "manage" ? "md" : "none"}
        borderRadius="20px"
        fontWeight="medium"
      >
        Manage Document
      </Button>
    </HStack>
  );
}
