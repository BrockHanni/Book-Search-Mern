const { gql } = require('apollo-server-express');


//GraphQL type definitions using the GraphQL schema language
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

    type Query {
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: SavedBookInput): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;