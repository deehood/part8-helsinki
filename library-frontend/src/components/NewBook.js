import { gql, useMutation } from "@apollo/client";

import { useState } from "react";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { ALL_AUTHORS } from "../queries/ALL_AUTHORS";

const NewBook = (props) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState("");
    const [genre, setGenre] = useState("");
    const [genresArray, setGenresArray] = useState([]);

    const CREATE_BOOK = gql`
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

    const [addBook] = useMutation(CREATE_BOOK, {
        refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    });
    if (!props.show) {
        return null;
    }
    const addGenre = () => {
        if (genre) setGenresArray(genresArray.concat(genre));
        setGenre("");
    };

    const submit = async (event) => {
        event.preventDefault();
        let genres = [...genresArray];
        if (genre) genres = genresArray.concat(genre);

        console.log(genre, genres);
        await addBook({
            variables: {
                title,
                author,
                published: parseInt(published),
                genres,
            },
        });

        setTitle("");
        setPublished("");
        setAuthor("");
        setGenresArray([]);
        setGenre("");
    };

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genresArray.join(" ")}</div>
                <button>create book</button>
            </form>
        </div>
    );
};

export default NewBook;
