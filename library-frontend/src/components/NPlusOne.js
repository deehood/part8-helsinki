import { useQuery } from "@apollo/client";
import { N_PLUS_ONE } from "../queries";

const NPlusOne = ({ token, show }) => {
    const result = useQuery(N_PLUS_ONE);

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
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <th> authors</th>
                                <th>books</th>
                            </tr>
                            <tr>
                                <td>
                                    <br />
                                </td>
                            </tr>
                            {result.data.allAuthors.map((a) => (
                                <tr key={a.name}>
                                    <td>{a.name}</td>
                                    <td>{a.bookCount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
};

export default NPlusOne;
