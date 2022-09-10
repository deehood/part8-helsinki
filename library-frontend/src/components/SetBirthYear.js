import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ALL_AUTHORS, EDIT_YEAR } from "../queries";

const SetBirthYear = ({ allAuthors }) => {
    const [name, setName] = useState(allAuthors[0]?.name || "");
    const [bornChange, setBornChange] = useState(allAuthors[0]?.born || 0);

    const [editAuthor] = useMutation(EDIT_YEAR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    const submitYear = async (event) => {
        event.preventDefault();

        bornChange &&
            (await editAuthor({
                variables: { name: name, bornChange: parseInt(bornChange) },
            }));
    };

    return (
        <>
            <h3>Set birth year</h3>
            <form onSubmit={submitYear}>
                <select
                    onChange={(e) => {
                        setName(e.target.value);
                        setBornChange(
                            allAuthors.find((a) => a.name === e.target.value)
                                .born || ""
                        );
                    }}
                >
                    {allAuthors.map((a) => (
                        <option key={a.name} value={a.name}>
                            {a.name}
                        </option>
                    ))}
                </select>

                <span>
                    born{" "}
                    <input
                        type="number"
                        value={bornChange}
                        onChange={(e) => setBornChange(e.target.value)}
                    />
                </span>
                <br />
                <button> update author</button>
            </form>
        </>
    );
};

export default SetBirthYear;
