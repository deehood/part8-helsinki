import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries/ALL_AUTHORS";
import SetBirthYear from "./SetBirthYear";

const Authors = ({ token, show }) => {
    const result = useQuery(ALL_AUTHORS);

    if (!show) {
        return null;
    }
    if (result.loading) {
        return <div>loading...</div>;
    }

    if (result.data)
        return (
            <div className={"wrapper"}>
                <div>
                    <h2>authors</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th></th>
                                <th>born</th>
                                <th>books</th>
                            </tr>
                            {result.data.allAuthors.map((a) => (
                                <tr key={a.name}>
                                    <td>{a.name}</td>
                                    <td>{a.born}</td>
                                    <td>{a.bookCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    {token && (
                        <SetBirthYear allAuthors={result.data.allAuthors} />
                    )}
                </div>
            </div>
        );
};

export default Authors;
