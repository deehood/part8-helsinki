import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries/LOGIN";

const Login = ({ setPage, setToken, show }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            console.log(error.graphQLErrors[0].message);
        },
    });
    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value;
            setToken(token);
            localStorage.setItem("user-token", token);
            console.log(`logged in as ${username}`);
            setUsername("");
            setPassword("");
            setPage("authors");
        }
    }, [result.data]);

    if (!show) {
        return null;
    }

    const submit = (e) => {
        e.preventDefault();
        login({ variables: { username, password } });
    };

    return (
        <div>
            <form onSubmit={submit}>
                username{" "}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                ></input>
                <br />
                password{" "}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                ></input>
                <button>login</button>
            </form>
        </div>
    );
};

export default Login;
