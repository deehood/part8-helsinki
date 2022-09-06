import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { useState } from "react";

const Books = (props) => {
    const [genre, setGenre] = useState(null);
    const result = useQuery(ALL_BOOKS, { variables: { genre } });

    if (!props.show) {
        return null;
    }
    if (result.loading) {
        return <div>loading...</div>;
    }

    if (result.error) return <>{result.error.message}</>;

    result.refetch();
    const uniqueGenres = Array.from(
        new Set(result.data.allBooks.map((obj) => obj.genres).flat())
    );
    return (
        <div>
            <h2>books</h2>
            <b>Genres</b>
            <br />
            <button onClick={() => setGenre(null)}>All</button>
            {uniqueGenres.map((genre, index) => (
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
