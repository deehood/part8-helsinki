const { AuthenticationError, UserInputError } = require("apollo-server");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Author = require("../models/Author");
const Book = require("../models/Book");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET;
const resolvers = {
    Author: {
        bookCount: async (root) => {
            console.log("bookcount");
            const books = await Book.find({ author: root.id });
            return books.length;
        },
    },
    Book: {
        author: async (root) => {
            const author = await Author.findById(root.author);
            return author;
        },
    },

    Query: {
        me: (root, args, context) => {
            return context.currentUser;
        },
        authorCount: async () => Author.collection.countDocuments(),
        bookCount: async () => Book.collection.countDocuments(),
        // Must pass root
        allBooks: async (root, args) => {
            // .only gets what it needs

            const author = args.author
                ? await Author.findOne({ name: args.author })
                : null;

            let query = author ? { author: author._id } : {};

            if (args.genre && args.genre !== "All") {
                query = { ...query, genres: args.genre };
            }

            return Book.find(query).populate("author");
        },
        allAuthors: async (root, args) => {
            const results = await Author.find({}).populate("book");
            console.log("allAuthors");

            return results;
        },
    },

    Mutation: {
        addBook: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError("not authenticated");
            }
            const found = await Author.findOne({ name: args.author });

            let newAuthorObj = {};

            if (!found) {
                const newAuthor = new Author({ name: args.author });
                try {
                    newAuthorObj = await newAuthor.save();
                } catch (error) {
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    });
                }
            }

            const book = new Book({
                ...args,
                author: found || newAuthorObj,
            });
            try {
                await book.save();
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            }
            pubsub.publish("BOOK_ADDED", { bookAdded: book });
            return book;
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new AuthenticationError("not authenticated");
            }
            console.log("resolver", args);
            const author = await Author.findOneAndUpdate(
                {
                    name: args.name,
                },
                {
                    born: args.bornChange,
                },
                { new: true }
            );

            return author;
        },
        createUser: async (root, args) => {
            const user = new User({
                username: args.username,
                favoriteGenre: args.favoriteGenre,
                password: JWT_SECRET,
            });
            console.log(user);
            return user.save().catch((error) => {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                });
            });
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username });
            console.log("login");
            if (!user || args.password !== JWT_SECRET) {
                throw new UserInputError("wrong credentials");
            }
            const userForToken = {
                username: user.username,
                id: user._id,
            };

            return { value: jwt.sign(userForToken, JWT_SECRET) };
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
        },
    },
};

module.exports = resolvers;
