import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { useState, useRef } from "react";

const Books = (props) => {
    const [genre, setGenre] = useState("All");
    const result = useQuery(ALL_BOOKS, { variables: { genre } });
    const uniqueGenres = useRef(null);
    if (!props.show) {
        return null;
    }
    // if (result.loading) {
    //     return <div>loading...</div>;
    // }

    if (result.error) return <>{result.error.message}</>;
    // console.log(uniqueGenres.current);
    if (uniqueGenres.current === null && result.data) {
        uniqueGenres.current = Array.from(
            new Set(result.data.allBooks.map((obj) => obj.genres).flat())
        );
    }
    // }

    //TODO temp solution for adding book missing genre from add book

    result.refetch();
    return (
        <div>
            <h2>books</h2>
            <b>Genres</b>
            <br />
            {uniqueGenres.current &&
                ["All", ...uniqueGenres.current].map((mappedGenre, index) => (
                    <button
                        className={
                            mappedGenre === genre ? "selected-tab" : null
                        }
                        key={index}
                        onClick={() => setGenre(mappedGenre)}
                    >
                        {mappedGenre}
                    </button>
                ))}

            {result.loading === true ? null : (
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
                                <td>
                                    {x.genres.map(
                                        (a, index) =>
                                            a +
                                            (index + 1 === x.genres.length
                                                ? ""
                                                : ", ")
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Books;
