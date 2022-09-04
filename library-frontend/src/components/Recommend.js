import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries/ALL_BOOKS";
import { ME } from "../queries/ME";

const Recommend = ({ show }) => {
    const books = useQuery(ALL_BOOKS);
    const me = useQuery(ME);
    if (!show) return null;

    if (books.loading | me.loading) {
        return <div>loading...</div>;
    }

    me.refetch();

    if (books?.error | me?.error)
        return (
            <>
                {books.error.message} {me.error.message}
                {" Error"}
            </>
        );
    else {
        return !me.data?.me?.favoriteGenre ? (
            <>no favorite genre defined</>
        ) : (
            <>
                <h2>Recommend for {me.data.me.username}</h2>
                books in your favorite genre <b>"{me.data.me.favoriteGenre}"</b>
                <br />
                <br />
                <table>
                    <tbody>
                        <tr>
                            <th>books</th>
                            <th>author</th>
                            <th>published</th>
                            <th>genres</th>
                        </tr>

                        {books.data.allBooks
                            .filter((a) =>
                                a.genres.includes(me.data.me.favoriteGenre)
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
            </>
        );
    }
};
export default Recommend;
