import { 
    Box, 
    Flex,
    Grid, 
    Text, 
    Link, 
    Table, Thead, Tbody, Tr, Th, Td,
    Alert,
    Spinner,
    GridItem,
    useBreakpointValue
} from "@chakra-ui/react";
import {
    useState,
    useEffect,
    useRef,
    
} from 'react';
import { ChevronLeftIcon } from "@chakra-ui/icons";
import axios from "axios";

const API_URL = "http://localhost:8001";


const fetchScoreData = () => {

    return [initialMAP, extendedMAP, iniitial]
}



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
const WideTable = ({query1, query2}) => (
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
            {query1.map((query,index)=>(
                <Tr 
               >
                    <Td>{query.id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query.text}</Td>
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
                        {query.AP}
                        </Box>
                    </Td>
                   
                    <Td borderLeft={"1px solid"}>{query2[index].id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query2[index].text}</Td>

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
                        {query2[index].AP}
                        </Box>
                        </Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
)
const QueryResultTable = ({title, queries}) => (
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
            {queries.map((query,index)=>(
                <Tr key={query.id} 
               >
                    <Td>{query.id}</Td>
                    <Td textAlign={"justify"} whiteSpace={"normal"} wordBreak={"break-word"}>{query.text}</Td>
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
          {query.AP}
        </Box></Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
)


const BatchDetailPage = () => {
    const [mapData, setMapData] = useState({
        initial: null,
        expanded: null
    });
    const [initialQueries, setInitialQueries] = useState([]);
    const [expandedQueries, setExpandedQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isWideScreen = useBreakpointValue({ base: false, md: true });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [mapInit, mapExtended, awal, akhir] = await Promise.all([
                    axios.get(`${API_URL}/api/map-init`),
                    axios.get(`${API_URL}/api/map-extended`),
                    axios.get(`${API_URL}/api/query-awal`),
                    axios.get(`${API_URL}/api/query-akhir`)
                ]);

                setMapData({
                    initial: mapInit.data?.value || null,
                    expanded: mapExtended.data?.value || null
                });

                setInitialQueries(awal.data || []);
                setExpandedQueries(akhir.data || []);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        
    }, []);
    
    if (error) return <Alert status="error">{error.message || error.toString()}</Alert>;
    if (loading) {
    return (
        <Flex align="center" justify="center" height="60vh">
        <Spinner size="xl" />
        </Flex>
    );
    }
    return (
        <Box p={6}>
            <Link href="#" display="flex" alignItems="center" mb={6}>
                <ChevronLeftIcon boxSize={6}/>
                <Text fontSize="xs">Back to Search</Text>
            </Link>
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
                    value={mapData.initial?.toFixed(2) || 'N/A'} />
                <Box position="relative" pt={4}>
                    <QueryResultTable 
                    title="Initial Query" 
                    queries={initialQueries.length ? initialQueries : [{id: '-', text: 'No data available', AP: 0}]}
                    />

                </Box>
                </Box>

                {/* Expanded Query Column */}
                <Box flex={1}>
                <MetricCard title="mAP Expanded Query"
                 value={mapData.expanded?.toFixed(2) || 'N/A'} />
                <Box pt={4}>
                    <QueryResultTable 
                    title="Expanded Query" 
                    queries={expandedQueries}
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
                        value={mapData.initial?.toFixed(2) || 'N/A'} 
                        />
                    </GridItem>

                    <GridItem 
                        w="100%" maxW="400px"
                    >
                        <MetricCard 
                        title="mAP Expanded Query" 
                        value={mapData.expanded?.toFixed(2) || 'N/A'} 
                        />
                    </GridItem>

                    {/* Second Row: Full-width Table */}
                    <GridItem 
                        colSpan={{ base: 1, md: 3 }}  // Spans all columns on desktop
                        mt={4}
                    >
                        <WideTable query1={initialQueries} query2={expandedQueries} />
                    </GridItem>
                    </Grid>
            )}
          
        </Box>
    )

};



export default BatchDetailPage;