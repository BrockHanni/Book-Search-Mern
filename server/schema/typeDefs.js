const { gql } = require('apollo-server-express');

// Define your GraphQL schema using the gql template literal
const typeDefs = gql`

    type Book {
        title: String
        authors: [String]
        description: String
        bookId: ID 
        image: String
        link: String
    }

    input SavedBookInput {
        title: String
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
    }

    type User {
        username: String
        email: String
        _id: ID
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        user: User
        token: ID
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: SavedBookInput): User
        removeBook(bookId: String!): User
    }

    type Query {
        me: User
    }
`;

// Export the GraphQL type definitions
module.exports = typeDefs;