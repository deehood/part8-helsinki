const { gql } = require("apollo-server");

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
    type Subscription {
        bookAdded: Book!
    }
`;

module.exports = typeDefs;
