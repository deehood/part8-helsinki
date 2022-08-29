const {
    ApolloServer,
    AuthenticationError,
    UserInputError,
    gql,
} = require("apollo-server");
const jwt = require("jsonwebtoken");
const { UniqueDirectiveNamesRule } = require("graphql");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("connecting....");
const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");
const { collection } = require("./models/Author");

const JWT_SECRET = process.env.SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting : ", error.message);
    });

let authors = [
    {
        name: "Robert Martin",

        born: 1952,
    },
    {
        name: "Martin Fowler",
        born: 1963,
    },
    {
        name: "Fyodor Dostoevsky",
        born: 1821,
    },
    {
        name: "hello ",
        born: 1821,
    },
    {
        name: "Joshua Kerievsky", // birthyear not known
    },
    {
        name: "Mick Metz", // birthyear not known
    },
];

let books = [
    {
        title: "Clean Code",
        published: 2008,
        author: "Robert Martin",
        genres: ["refactoring"],
    },
    {
        title: "Agile software development",
        published: 2002,
        author: "Robert Martin",
        genres: ["agile", "patterns", "design"],
    },
    {
        title: "Refactoring, edition 2",
        published: 2018,
        author: "Martin Fowler",
        genres: ["refactoring"],
    },

    {
        title: "Refactoring to patterns",
        published: 2008,
        author: "Joshua Kerievsky",
        genres: ["refactoring", "patterns"],
    },
    {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        author: "Mick Metz",
        genres: ["refactoring", "design"],
    },
    {
        title: "Crime and punishment",
        published: 1866,
        author: "Fyodor Dostoevsky",
        genres: ["classic", "crime"],
    },
    {
        title: "The Demon ",
        published: 1872,
        author: "Fyodor Dostoevsky",
        genres: ["classic", "revolution"],
    },
];

const loadInitial = async () => {
    await Author.collection.drop();
    await Book.collection.drop();

    for (const author of authors) {
        const newAuthor = new Author(author);

        await newAuthor.save();
    }
    for (const book of books) {
        console.log(book);
        const authorObj = await Author.findOne({ name: book.author });

        const newBook = new Book({ ...book, author: authorObj });
        await newBook.save();
    }
};

// loadInitial();

const typeDefs = gql`
    type User {
        username: String!
        favoriteGenre: String
        id: ID!
    }

    type Token {
        value: String!
    }
    type Author {
        name: String!
        born: Int
        bookCount: Int!
        id: ID!
    }
    type Book {
        title: String!
        published: Int!
        author: Author!
        genres: [String]!
        id: ID!
    }
    type Query {
        me: User
        authorCount: Int!
        bookCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
    }

    type Mutation {
        addBook(
            title: String!
            author: String!
            published: Int!
            genres: [String]
        ): Book!

        editAuthor(name: String!, bornChange: Int!): Author

        createUser(username: String!, favoriteGenre: String!): User
        login(username: String!, password: String!): Token
    }
`;

const resolvers = {
    Author: {
        bookCount: async (root) => {
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
            // returns all books by default .
            let result = await Book.find({});
            if (args.author) {
                const foundAuthor = await Author.findOne({ name: args.author });
                result = result.filter(
                    (book) =>
                        book.author.toString() === foundAuthor._id.toString()
                );
            }

            if (args.genre) {
                result = result.filter((book) =>
                    book.genres.includes(args.genre)
                );
            }

            return result;
        },
        allAuthors: async (root, args) => {
            const results = await Author.find({});

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
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.toLowerCase().startsWith("bearer ")) {
            const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
            const currentUser = await User.findById(decodedToken.id);

            return { currentUser };
        }
    },
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url} 🚀`);
});
