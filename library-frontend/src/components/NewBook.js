import { useMutation } from "@apollo/client";

import { useState } from "react";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { ALL_AUTHORS } from "../queries/ALL_AUTHORS";
import { CREATE_BOOK } from "../queries/CREATE_BOOK";

const NewBook = (props) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [published, setPublished] = useState("");
    const [genre, setGenre] = useState("");
    const [genresArray, setGenresArray] = useState([]);

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
        <form onSubmit={submit}>
            <div className="wrapper-add-book">
                <div>
                    <div className="field">
                        <label htmlFor="title">title</label>
                        <input
                            type="text"
                            placeholder="title"
                            id="title"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </div>
                    <div className="field">
                        author
                        <input
                            type="text"
                            value={author}
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </div>
                    <div className="field">
                        published
                        <input
                            type="number"
                            value={published}
                            onChange={({ target }) =>
                                setPublished(target.value)
                            }
                        />
                    </div>
                </div>
                <div className="right-side">
                    <div className="field">
                        <label htmlFor="genre">genres</label>
                        <input
                            id="genre"
                            value={genre}
                            onChange={({ target }) => setGenre(target.value)}
                        />
                        <button onClick={addGenre} type="button">
                            Add
                        </button>
                        <div>Added: {genresArray.join(" ")}</div>
                    </div>

                    <button>create book</button>
                </div>
            </div>
        </form>
    );
};

export default NewBook;
