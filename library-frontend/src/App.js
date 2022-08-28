import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import { useApolloClient } from "@apollo/client";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null);

    //use it to clean the  apollo store
    const client = useApolloClient();

    // refresh app checks for jwt in localStorage  , maybe could  check if can get jwt from apollo

    useEffect(() => {
        if (!token) {
            async function checkToken() {
                const token = await localStorage.getItem("user-token");
                setToken(token);
            }
            checkToken();
        }
    }, [token]);

    return (
        <div>
            <div>
                <button onClick={() => setPage("authors")}>authors</button>
                <button onClick={() => setPage("books")}>books</button>
                {token && (
                    <button onClick={() => setPage("add")}>add book</button>
                )}
                {!token ? (
                    <button onClick={() => setPage("login")}>login</button>
                ) : (
                    <button
                        onClick={() => {
                            setToken(null);
                            localStorage.clear();
                            client.resetStore();
                        }}
                    >
                        logout
                    </button>
                )}
            </div>

            <Authors token={token} show={page === "authors"} />
            <Books show={page === "books"} />
            <NewBook show={page === "add"} />
            <Login
                setPage={setPage}
                setToken={setToken}
                show={page === "login"}
            />
        </div>
    );
};

export default App;
