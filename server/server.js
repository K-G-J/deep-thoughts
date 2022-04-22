const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

const startServer = async () => {
  // create ApolloServer and pass in schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: 'authMiddleware'
  });

  // Start the Apollo server
  await server.start();

  // Integrate Apollo server with Express application as middleware
  server.applyMiddleware({ app });

  // log where to go to test our GQL API
  console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
}

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
