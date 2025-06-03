import { 
    Box, 
    Flex,
    Grid, 
    Text, 
    Table, Thead, Tbody, Tr, Th, Td,
    Alert,
    Spinner,
    GridItem,
    Button,
    useBreakpointValue
} from "@chakra-ui/react";
import {
    useState,    
    useEffect
} from 'react';
import { ChevronLeftIcon, AlertIcon} from "@chakra-ui/icons";



const MetricCard = ({title, value}) => (
    <Box 
    bg="rgba(244, 140, 6, 0.14)"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="md"
    p={2}
    boxShadow="sm"
    mx="auto"
    maxWidth="xs"
    h="auto"
    minH="auto"

    >
        <Flex 
        align="center"
        justify="center"
        direction="column"
        >
        <Text fontSize="lg" fontWeight="semibold" mb={2} color="gray.700">
            {title}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
            {value}
        </Text>
        </Flex>
    </Box>
);
const WideTable = ({queries}) => {
    return (
        <Table width="100%" variant="simple" layout="fixed">
            <Thead>
                <Tr>
                <Th width="100px"fontSize="md" color="black" fontWeight="bold">ID</Th>
                <Th minWidth="200px" fontSize="md"   color="black" fontWeight="bold" p="0">Initial Query</Th>
                <Th width="100px"fontSize="md" color="black" fontWeight="bold" border borderRight={"1px solid"} textAlign={"center"}>AP</Th>
                <Th width="100px" fontSize="md" color="black" fontWeight="bold" borderLeft={"1px solid"}>ID</Th>
                <Th minWidth="200px"fontSize="md" color="black" fontWeight="bold" p="0">Expanded Query</Th>
                <Th width="100px" fontSize="md" color="black" fontWeight="bold" border textAlign={"center"}>AP</Th>
                </Tr>
            </Thead>
        <Tbody>
            {queries.map(query => (
            <Tr key={query.query_id} overflow="hidden">
                <Td>{query.query_id}</Td>
                <Td pl="0" pb="0">
                    <Box
                    height="3em" // Fixed height for 2 lines
                    overflowY="auto"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    sx={{
                        '&::-webkit-scrollbar': {
                        width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '3px',
                        },
                    }}
                    >
                    {query.initial_query}
                    </Box>
                </Td>
                <Td borderRight={"1px solid"}>
                <Box 
                    as="span"
                    bg="rgba(244, 140, 6, 0.14)"
                    px={3}
                    py={1}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    display="inline-block"
                    minW="40px"
                    textAlign="center"
                >
                    {query.initial_ap.toFixed(4)}
                </Box>
                </Td>
                <Td borderLeft={"1px solid"}>{query.query_id}</Td>
                <Td pl="0" pb="0">
                    <Box
                    height="3em" // Fixed height for 2 lines
                    overflowY="auto"
                    whiteSpace="pre-wrap"
                    wordBreak="break-word"
                    sx={{
                        '&::-webkit-scrollbar': {
                        width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '3px',
                        },
                    }}
                    >
                    {query.expanded_query}
                    </Box>
                </Td>
                <Td>
                <Box 
                    as="span"
                    bg="rgba(244, 140, 6, 0.14)"
                    px={3}
                    py={1}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    display="inline-block"
                    minW="40px"
                    textAlign="center"
                >
                    {query.expanded_ap.toFixed(4)}
                </Box>
                </Td>
            </Tr>
            ))}
        </Tbody>
    </Table>

)}
const QueryResultTable = ({title, queries, index}) => (
    <Table width={"100%"}>
        <Thead>
            <Tr>
                <Th 
                    minWidth="3vw" 
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    >ID</Th>
                <Th 
                    width="100%"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    pl={0}
                    
                    >{title}</Th>
                <Th 
                    minWidth="3vw"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    textAlign={"center"}
                    >AP</Th>
            </Tr>
        </Thead>
        <Tbody>
            {queries.map(query => {
            const apVal = query[`${index}_ap`];
            const formattedAp = typeof apVal === 'number' ? apVal.toFixed(4) : apVal || 'N/A';
            
            return (
                <Tr key={query.query_id}>
                <Td>{query.query_id}</Td>
                <Td pl={0} pr={0}>
                    <Box
                    maxHeight="3em" // Shows exactly 2 lines (1.5em per line)
                    overflowY="auto"
                    whiteSpace="normal"
                    wordBreak="break-word"
                    css={{
                        '&::-webkit-scrollbar': {
                        width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '3px',
                        },
                    }}
                    >
                    {query[`${index}_query`]}
                    </Box>
                </Td>
                <Td>
                    <Box 
                    as="span"
                    bg="rgba(244, 140, 6, 0.14)"
                    px={3}
                    py={1}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    display="inline-block"
                    minW="40px"
                    textAlign="center"
                    >
                    {formattedAp}
                    </Box>
                </Td>
                </Tr>
            );
            })}
        </Tbody>
    </Table>
)


const BatchDetailPage = ({setMainNavbar, setPage, result}) => {
    // const [cachedResult, setCachedResult] = useState(() => {
    //     // Try to load from cache when component mounts
    //     const saved = sessionStorage.getItem('batchDetailResult');
    //     return saved ? JSON.parse(saved) : null;
    // });
    // useEffect(() => {
    //     if (result) {
    //         sessionStorage.setItem('batchDetailResult', JSON.stringify(result));
    //         setCachedResult(result);
    //     }
    // }, [result]);

    // Use cached result if available when no result is passed
    const displayResult = result; //|| cachedResult;
    
     useEffect(() => {
        setMainNavbar(false);
        if (!result) {
            setPage("batch");
            setMainNavbar(true);
            
        }
    }, [result, setMainNavbar, setPage]);
    // // Early return if result is undefined or null
    if (!displayResult) {
        return (
            <Box p={6}>
                <Button
                    leftIcon={<ChevronLeftIcon />}
                    variant="ghost"
                    color="black"
                    fontSize="sm"
                    fontWeight="normal"
                    _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                    onClick={() => {
                        
                        setPage("batch"); 
                        setMainNavbar(true);
                    }}
                    px={2}
                >
                    Back to Search
                </Button>
                <Alert status="warning" mt={4}>
                    <AlertIcon />
                    No batch data available. Please select a batch from the main page first.
                </Alert>
            </Box>
            
        );
        
    }
   




    const [error, setError] = useState(null);
    const isWideScreen = useBreakpointValue({ base: false, md: true });

    // Fallback data in case of empty queries
    const fallbackData = [{
        query_id: '-', 
        initial_query: 'No data available', 
        expanded_query: 'No data available', 
        initial_ap: 0, 
        expanded_ap: 0
    }];


    // Check if queries empty
    const queries = displayResult.query_results?.length ? displayResult.query_results : fallbackData;


    if (error) return <Alert status="error">{error.message || error.toString()}</Alert>;


    return (
        <Box p={6}>
            <Button
                leftIcon={<ChevronLeftIcon />}
                variant="ghost"
                color="black"
                fontSize="sm"
                fontWeight="normal"
                _hover={{ bg: 'transparent', textDecoration: 'underline' }}
                onClick={() => {
                setPage("batch"); 
                setMainNavbar(true);
                }}
                px={2}
            >
                Back to Search
            </Button>
            {/* Content Container */}
            {!isWideScreen ? (
            <Flex
                direction={{ base: "column", md: "row" }}
                gap={6}
                position="relative"
            >
                {/* Initial Query Column */}
                <Box flex={1}>
                    <MetricCard title="MAP Initial Query"
                        value={displayResult.map_initial?.toFixed(4) || 'N/A'} />
                    <Box position="relative" pt={4}>
                        <QueryResultTable 
                        title="Initial Query" 
                        queries={queries}
                        index="initial"
                        />

                    </Box>
                </Box>

                {/* Expanded Query Column */}
                <Box flex={1}>
                <MetricCard title="MAP Expanded Query"
                 value={displayResult.map_expanded?.toFixed(4) || 'N/A'} />
                <Box pt={4}>
                    <QueryResultTable 
                    title="Expanded Query" 
                    queries={queries} 
                    index="expanded"
                    />
                </Box>
                </Box>


            </Flex>
            ) : (
                // Combined Table
                <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={8}
                    w="full"
                    placeItems="center"
                    maxWidth="100%"
                    >
                    {/* First Row: Metric Cards - Positioned at edges */}
                    <GridItem 
                        w="100%" maxW="400px"             // Right padding/gap
                    >
                        <MetricCard 
                        title="MAP Initial Query" 
                        value={displayResult.map_initial?.toFixed(4) || 'N/A'} 
                        />
                    </GridItem>

                    <GridItem 
                        w="100%" maxW="400px"
                    >
                        <MetricCard 
                        title="MAP Expanded Query" 
                        value={displayResult.map_expanded?.toFixed(4) || 'N/A'} 
                        />
                    </GridItem>

                    {/* Second Row: Full-width Table */}
                    <GridItem 
                        colSpan={{ base: 1, md: 3 }}  // Spans all columns on desktop
                        mt={4}
                    >
                        <WideTable queries={queries}/>
                    </GridItem>
                    </Grid>
            )}
          
        </Box>
    )

};



export default BatchDetailPage;