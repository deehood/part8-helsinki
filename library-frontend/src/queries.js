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
            title
            published
            genres
            id
            author {
                name
                born
                bookCount
                id
            }
        }
    }
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
