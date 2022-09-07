const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");
// const { UniqueDirectiveNamesRule } = require("graphql");
// const { v4: uuid } = require("uuid");
// const { collection } = require("./models/Author");
const mongoose = require("mongoose");
require("dotenv").config();
console.log("connecting....");

const User = require("./models/User");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
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

// let authors = [
//     {
//         name: "Robert Martin",

//         born: 1952,
//     },
//     {
//         name: "Martin Fowler",
//         born: 1963,
//     },
//     {
//         name: "Fyodor Dostoevsky",
//         born: 1821,
//     },
//     {
//         name: "hello ",
//         born: 1821,
//     },
//     {
//         name: "Joshua Kerievsky", // birthyear not known
//     },
//     {
//         name: "Mick Metz", // birthyear not known
//     },
// ];

// let books = [
//     {
//         title: "Clean Code",
//         published: 2008,
//         author: "Robert Martin",
//         genres: ["refactoring"],
//     },
//     {
//         title: "Agile software development",
//         published: 2002,
//         author: "Robert Martin",
//         genres: ["agile", "patterns", "design"],
//     },
//     {
//         title: "Refactoring, edition 2",
//         published: 2018,
//         author: "Martin Fowler",
//         genres: ["refactoring"],
//     },

//     {
//         title: "Refactoring to patterns",
//         published: 2008,
//         author: "Joshua Kerievsky",
//         genres: ["refactoring", "patterns"],
//     },
//     {
//         title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//         published: 2012,
//         author: "Mick Metz",
//         genres: ["refactoring", "design"],
//     },
//     {
//         title: "Crime and punishment",
//         published: 1866,
//         author: "Fyodor Dostoevsky",
//         genres: ["classic", "crime"],
//     },
//     {
//         title: "The Demon ",
//         published: 1872,
//         author: "Fyodor Dostoevsky",
//         genres: ["classic", "revolution"],
//     },
// ];

// const loadInitial = async () => {
//     await Author.collection.drop();
//     await Book.collection.drop();

//     for (const author of authors) {
//         const newAuthor = new Author(author);

//         await newAuthor.save();
//     }
//     for (const book of books) {
//         console.log(book);
//         const authorObj = await Author.findOne({ name: book.author });

//         const newBook = new Book({ ...book, author: authorObj });
//         await newBook.save();
//     }
// };

// loadInitial();

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
