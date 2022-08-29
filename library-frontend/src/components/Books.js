import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { useState } from "react";

const Books = (props) => {
    const [genreFilter, setGenreFilter] = useState(null);
    const result = useQuery(ALL_BOOKS);

    if (!props.show) {
        return null;
    }

    if (result.loading) {
        return <div>loading...</div>;
    }

    if (result.error) return <>{result.error.message}</>;
    else {
        let uniqueGenresSet = new Set(
            result.data.allBooks.map((obj) => obj.genres).flat()
        );

        // transform set in array to use map in render
        const uniqueGenresArray = [...uniqueGenresSet];

        return (
            <div>
                <h2>books</h2>
                <b>Genres</b>
                <br />
                <button onClick={() => setGenreFilter(null)}>All</button>
                {uniqueGenresArray.map((genre, index) => (
                    <button key={index} onClick={() => setGenreFilter(genre)}>
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

                        {result.data.allBooks
                            .filter((a) =>
                                genreFilter
                                    ? a.genres.includes(genreFilter)
                                    : a.genres
                            )
                            .map((x) => (
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
    }
};

export default Books;
