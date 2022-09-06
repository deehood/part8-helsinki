import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { useEffect, useState, useRef } from "react";

const Books = (props) => {
    const [genre, setGenre] = useState(null);
    const result = useQuery(ALL_BOOKS, { variables: { genre } });
    const uniqueGenres = useRef();
    useEffect(() => {
        uniqueGenres.current = Array.from(
            new Set(result.data.allBooks.map((obj) => obj.genres).flat())
        );
    }, [result.data.allBooks]);

    if (!props.show) {
        return null;
    }
    if (result.loading) {
        return <div>loading...</div>;
    }

    if (result.error) return <>{result.error.message}</>;
    else
        return (
            <div>
                <h2>books</h2>
                <b>Genres</b>
                <br />
                <button onClick={() => setGenre(null)}>All</button>
                {uniqueGenres.current.map((genre, index) => (
                    <button key={index} onClick={() => setGenre(genre)}>
                        {genre}
                    </button>
                ))}

                <table>
                    <tbody>
                        <tr>
                            <th>books</th>
                            <th>author</th>
                            <th>published</th>
                            <th>genres</th>
                        </tr>

                        {result.data.allBooks.map((x) => (
                            <tr key={x.title}>
                                <td>{x.title}</td>
                                <td>{x.author.name}</td>
                                <td>{x.published}</td>
                                <td>{x.genres.map((a) => a + ", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
};

export default Books;
