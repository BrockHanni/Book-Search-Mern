const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (context) => {
            // checks to see if logged in, if so, lets users select books, if not, throws error
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {
        // mutation to add a user
        addUser: async (args) => {
            const username = await User.create(args);
            const token = signToken(username);
            return { token, username };
        },
        // mutation to login a user
        login: async ({ email, password }) => {
            const username = await User.findOne({ email });
            // gets the user 
            const correctPassword = await username.isCorrectPassword(password);
            const token = signToken(username);
            // checks for correct password
            if (!correctPassword) {
                throw new AuthenticationError('Invalid Password');
            }
            // checks for correct email
            if (!username) {
                throw new AuthenticationError('Invalid Username');
            }
            return { token, username };
        },
        saveBook: async ({ input }, context) => {
        
            if (context.user) {
                // adds book to savedBooks array, by updating the user's library
                const updateLib = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } }, 
                    { new: true, runValidators: true }
                ); 
                return updateLib;
            }
            throw new AuthenticationError("To save a book, please log in!");
        },
       
        removeBook: async ({ bookId }, context) => {
            // removes book from savedBooks array, by updating the user's library
            if (context.user) {
                const updatedLib = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } }, 
                    { new: true, runValidators: true }
                );
                return updatedLib;
            }
            throw new AuthenticationError('To remove a book, please log in!');
        }
    }
}

module.exports = resolvers;