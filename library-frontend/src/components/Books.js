import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";

const Books = (props) => {
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

        console.log(uniqueGenresSet);

        const uniqueGenresArray = [...uniqueGenresSet];
        return (
            <div>
                <h2>books</h2>
                <b>Genres</b>
                <br />
                {uniqueGenresArray.map((genre, index) => (
                    <button key={index}>{genre}</button>
                ))}

                <table>
                    <tbody>
                        <tr>
                            <th>books</th>
                            <th>author</th>
                            <th>published</th>
                            <th>genres</th>
                        </tr>

                        {result.data.allBooks.map((a) => (
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                                <td>{a.genres.map((a) => a + ", ")}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default Books;
