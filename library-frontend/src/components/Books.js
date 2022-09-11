import { useQuery, useSubscription } from "@apollo/client";
import { ALL_BOOKS, BOOK_ADDED } from "../queries";
import { useState, useRef } from "react";

const Books = (props) => {
    const [genre, setGenre] = useState("All");
    const result = useQuery(ALL_BOOKS, { variables: { genre } });

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData, client }) => {
            alert(`book - ${subscriptionData.data.bookAdded.title} was added`);
            client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
                console.log(allBooks.concat(subscriptionData.data.bookAdded));

                client.refetchQueries({
                    include: [ALL_BOOKS],
                });
                return {
                    allBooks: allBooks.concat(subscriptionData.data.bookAdded),
                };
            });
        },
    });

    const uniqueGenres = useRef(null);
    if (!props.show) {
        return null;
    }

    if (result.error) return <>{result.error.message}</>;

    if (uniqueGenres.current === null && result.data) {
        uniqueGenres.current = Array.from(
            new Set(result.data.allBooks.map((obj) => obj.genres).flat())
        );
    }

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
            <br /> <br />
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
