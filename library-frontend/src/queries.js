import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`;

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
            id
        }
    }
`;
const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        genres
        id
        author {
            name
            born
        }
    }
`;

export const N_PLUS_ONE = gql`
    query {
        allAuthors {
            name

            bookCount
        }
    }
`;

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;
export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`;

export const ALL_BOOKS = gql`
    query ($genre: String) {
        allBooks(genre: $genre) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`;

export const CREATE_BOOK = gql`
    mutation addBook(
        $title: String!
        $author: String!
        $published: Int!
        $genres: [String]
    ) {
        addBook(
            title: $title
            author: $author
            published: $published
            genres: $genres
        ) {
            title
            id
        }
    }
`;

export const EDIT_YEAR = gql`
    mutation editAuthor($name: String!, $bornChange: Int!) {
        editAuthor(name: $name, bornChange: $bornChange) {
            name
            born
        }
    }
`;
