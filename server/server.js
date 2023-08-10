// Importing required modules and packages
const express = require('express'); // Importing the Express web framework
const { ApolloServer } = require('apollo-server-express'); // Importing Apollo Server for GraphQL
const path = require('path'); // Importing Node.js path module
const db = require('./config/connection'); // Importing database connection settings
const routes = require('./routes'); // Importing custom routes
const app = express(); // Creating an Express application
const PORT = process.env.PORT || 3001; // Setting the port number for the server to listen on

// Setting up middleware to parse incoming requests
app.use(express.urlencoded({ extended: true })); // Allowing parsing of URL-encoded data
app.use(express.json()); // Allowing parsing of JSON data in requests

// Function to start the Apollo Server
async function startServer() {
  await server.start(); // Starting the Apollo Server
  server.applyMiddleware({ app }); // Applying the Apollo Server middleware to the Express app
}

// GraphQL schema - type definitions (typeDefs) and resolvers
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Starting the server!", // Resolving the "hello" query with a static message
  },
};

// Creating an instance of Apollo Server with defined schema and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Starting the Apollo Server
startServer();

// Serving static files in production mode
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build'))); // Serving static files from the "build" directory
}

app.use(routes); // Applying custom routes to the Express app

// Database event listener for when the connection is established
db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`)); // Starting the Express server
});