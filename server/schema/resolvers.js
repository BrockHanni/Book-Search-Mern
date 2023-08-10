// Importing necessary modules and functions
const { AuthenticationError } = require('apollo-server-express'); // Importing Apollo Server's AuthenticationError
const { User } = require('../models'); // Importing the User model
const { signToken } = require('../utils/auth'); // Importing the signToken function from the auth utility

// Resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    me: async (context) => {
      // Query to get the user's data if logged in
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
  Mutation: {
    addUser: async (args) => {
      // Mutation to add a new user
      const username = await User.create(args);
      const token = signToken(username);
      return { token, username };
    },
    login: async ({ email, password }) => {
      // Mutation to log in a user
      const username = await User.findOne({ email });
      // Fetches the user and checks their password
      const correctPassword = await username.isCorrectPassword(password);
      const token = signToken(username);

      // Checking for correct password
      if (!correctPassword) {
        throw new AuthenticationError('Invalid Password');
      }
      // Checking for correct email
      if (!username) {
        throw new AuthenticationError('Invalid Username');
      }

      return { token, username };
    },
    removeBook: async ({ bookId }, context) => {
      // Mutation to remove a book from the user's savedBooks array
      if (context.user) {
        const updatedLib = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true, runValidators: true }
        );
        return updatedLib;
      }
      throw new AuthenticationError('To remove a book, please log in!');
    },
    saveBook: async ({ input }, context) => {
      // Mutation to save a book to the user's savedBooks array
      if (context.user) {
        const updateLib = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
        return updateLib;
      }
      throw new AuthenticationError("To save a book, please log in!");
    },
  },
};

module.exports = resolvers;