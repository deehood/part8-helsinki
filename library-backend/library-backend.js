const { ApolloServer, gql } = require("apollo-server");
const { UniqueDirectiveNamesRule } = require("graphql");
const { v4: uuid } = require("uuid");

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "hello ",
    id: "afa5b6f1-34as1e9-a414-719c6709cf3e",
    born: 1821,
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },

  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type Book {
    title: String!
    author: String!
    published: Int!
    genres: [String]!
    id: ID!
  }
  type Query {
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
    ): Book

    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

const resolvers = {
  Author: {
    bookCount: (root) => {
      return books.filter((book) => book.author === root.name).length;
    },
  },
  Query: {
    authorCount: () => authors.length,
    bookCount: () => books.length,
    // Must pass root
    allBooks: (root, args) => {
      // returns all books by default .
      let result = [...books];
      if (args.author) {
        result = result.filter((book) => book.author === args.author);
      }

      if (args.genre) {
        result = result.filter((book) => book.genres.includes(args.genre));
      }
      return result;
    },
    allAuthors: () => authors,
  },

  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() };
      books = books.concat(book);
      const found = authors.find((author) => author.name === args.author);
      if (!found) {
        const newAuthor = { name: args.author, id: uuid() };
        authors.push(newAuthor);
      }
      return book;
    },
    editAuthor: (root, args) => {
      const authorIndex = authors.findIndex(
        (author) => author.name === args.name
      );
      if (authorIndex >= 0) {
        authors[authorIndex] = {
          ...authors[authorIndex],
          born: args.setBornTo,
        };
        return authors[authorIndex];
      }

      return null;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`???? Server ready at ${url} ????`);
});
