import { Box, Button, Text, VStack } from '@chakra-ui/react'


function App() {
  return (
    <Box p={8}>
      <VStack spacing={4}>
        <Text fontSize="3xl">Halo dari Chakra UI!</Text>
        <Button colorScheme="teal">Klik saya</Button>
      </VStack>
    </Box>
  )
}

export default App
