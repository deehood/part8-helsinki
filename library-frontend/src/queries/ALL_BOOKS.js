import { gql } from "@apollo/client";
export const ALL_BOOKS = gql`
    query {
        allBooks {
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
