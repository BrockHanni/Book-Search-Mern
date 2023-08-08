// Importing necessary dependencies and utility functions
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Resolver functions
const resolvers = {
    Query: {
        me: async (context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        // Resolver for the 'addUser' mutation, which adds a new user to the database
        addUser: async (args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async ({ email, password }) => {
            const user = await User.findOne({ email });
            const correctPw = await user.isCorrectPassword(password);
            const token = signToken(user);
            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            return { token, user };
        },
        // Resolver for the 'saveBook' mutation, which saves a book for the logged-in user
        saveBook: async ({ input }, context) => {
        
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } }, 
                    { new: true, runValidators: true }
                ); 
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in!");
        },
       
        removeBook: async ({ bookId }, context) => {
            
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }, 
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}

module.exports = resolvers;