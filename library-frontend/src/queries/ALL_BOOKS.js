import { gql } from "@apollo/client";
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
