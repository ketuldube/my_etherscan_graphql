const { ApolloServer } = require("apollo-server");

// Import the GraphQL schema from the schema.graphql file
const { importSchema } = require("graphql-import");  

// Import the custom EtherDataSource data source
const EtherDataSource = require("./datasource/ethDatasource");  

// Import the schema
const typeDefs = importSchema("./schema.graphql");

// Load environment variables from .env file
require("dotenv").config();

// Resolvers that delegate to EtherDataSource methods 
const resolvers = {
 Query: {
   etherBalanceByAddress: (root, _args, { dataSources }) =>
     dataSources.ethDataSource.etherBalanceByAddress(),

   totalSupplyOfEther: (root, _args, { dataSources }) =>  
     dataSources.ethDataSource.totalSupplyOfEther(),

   latestEthereumPrice: (root, _args, { dataSources }) =>
     dataSources.ethDataSource.getLatestEthereumPrice(),

   blockConfirmationTime: (root, _args, { dataSources }) =>
     dataSources.ethDataSource.getBlockConfirmationTime(),
 },
};

// Create ApolloServer instance
const server = new ApolloServer({
 typeDefs,
 resolvers,
 dataSources: () => ({
   ethDataSource: new EtherDataSource(),  
 }), 
});

// Set timeout to 0 (no timeout)
server.timeout = 0;

// Start the server
server.listen("9000").then(({ url }) => {
 console.log(`🚀 Server ready at ${url}`); 
});
