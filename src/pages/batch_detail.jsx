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
    <Table>
        <Thead>
            <Tr>
                <Th 
                    minWidth="3vw" 
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    >ID</Th>
                <Th 
                    width="40%"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    >InitialQuery</Th>
                <Th 
                    minWidth="3vw"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    border
                    borderRight={"1px solid"}
                    textAlign={"center"}
                    >AP</Th>
                    
                    <Th 
                    minWidth="3vw" 
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    borderLeft={"1px solid"}
                    >ID</Th>
                <Th 
                    width="40%"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    >Expanded Query</Th>
                <Th 
                    minWidth="3vw"
                    fontSize="md"
                    color="black"
                    fontWeight="bold"
                    border
                    textAlign={"center"}
                    >AP</Th>
            </Tr>
        </Thead>
        <Tbody>
            {queries.map(query=>(
                <Tr 
               >
                    <Td>{query.query_id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query.initial_query}</Td>
                    <Td borderRight={"1px solid"}>
                        <Box 
                        as="span"
                        bg="rgba(244, 140, 6, 0.14)" // Use your color palette
                        px={3}
                        py={1}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        display="inline-block"
                        minW="40px"
                        textAlign="center"
                        >
                        {query.initial_ap.toFixed(2)}
                        </Box>
                    </Td>
                   
                    <Td borderLeft={"1px solid"}>{query.query_id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query.expanded_query}</Td>

                    <Td>
                        <Box 
                        as="span"
                        bg="rgba(244, 140, 6, 0.14)" // Use your color palette
                        px={3}
                        py={1}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        display="inline-block"
                        minW="40px"
                        textAlign="center"
                        alignSelf={"start"}
                        >
                        {query.expanded_ap.toFixed(2)}
                        </Box>
                        </Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
)}
const QueryResultTable = ({title, queries, index}) => (
    <Table>
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
            {queries.map( query=>{
                const apVal = query[`${index}_ap`];
                const formattedAp = typeof apVal === 'number' ? apVal.toFixed(2) : apVal || 'N/A';
                return (
                <Tr key={query.query_id} 
               >
                    <Td>{query.query_id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query[`${index}_query`]}</Td>
                    <Td><Box 
          as="span"
          bg="rgba(244, 140, 6, 0.14)" // Use your color palette
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
        </Box></Td>
                </Tr>
        );})}
        </Tbody>
    </Table>
)


const BatchDetailPage = ({setMainNavbar, setPage, result}) => {
    const [cachedResult, setCachedResult] = useState(() => {
        // Try to load from cache when component mounts
        const saved = sessionStorage.getItem('batchDetailResult');
        return saved ? JSON.parse(saved) : null;
    });
    useEffect(() => {
        if (result) {
            sessionStorage.setItem('batchDetailResult', JSON.stringify(result));
            setCachedResult(result);
        }
    }, [result]);

    // Use cached result if available when no result is passed
    const displayResult = result || cachedResult;
    
    // Early return if result is undefined or null
    if (!result) {
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
    const queries = result.query_results?.length ? result.query_results : fallbackData;


    if (error) return <Alert status="error">{error.message || error.toString()}</Alert>;

    console.log(result)
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
                    <MetricCard title="mAP Initial Query"
                        value={result.map_initial?.toFixed(2) || 'N/A'} />
                    <Box position="relative" pt={4}>
                        <QueryResultTable 
                        title="Initial Query" 
                        queries={result.query_results.length ? result.query_results : [{query_id: '-', initial_query: 'No data available', initial_ap: 0}]}
                        index="initial"
                        />

                    </Box>
                </Box>

                {/* Expanded Query Column */}
                <Box flex={1}>
                <MetricCard title="mAP Expanded Query"
                 value={result.map_expanded?.toFixed(2) || 'N/A'} />
                <Box pt={4}>
                    <QueryResultTable 
                    queries={result.query_results.length ? result.query_results : [{query_id: '-', expanded_query: 'No data available', expanded_ap: 0}]} 
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
                    >
                    {/* First Row: Metric Cards - Positioned at edges */}
                    <GridItem 
                        w="100%" maxW="400px"             // Right padding/gap
                    >
                        <MetricCard 
                        title="mAP Initial Query" 
                        value={result.map_initial?.toFixed(2) || 'N/A'} 
                        />
                    </GridItem>

                    <GridItem 
                        w="100%" maxW="400px"
                    >
                        <MetricCard 
                        title="mAP Expanded Query" 
                        value={result.map_expanded?.toFixed(2) || 'N/A'} 
                        />
                    </GridItem>

                    {/* Second Row: Full-width Table */}
                    <GridItem 
                        colSpan={{ base: 1, md: 3 }}  // Spans all columns on desktop
                        mt={4}
                    >
                        <WideTable queries={result.query_results}/>
                    </GridItem>
                    </Grid>
            )}
          
        </Box>
    )

};



export default BatchDetailPage;