const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// importing the resolvers and typeDefs
const resolvers = {
  Query: {
    hello: () => "Starting the server!",
  },
};

const typeDefs = `
  type Query {
    hello: String
  }
`;

// applying the typeDefs and resolvers to the ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// starting the ApolloServer
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});