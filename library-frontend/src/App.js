import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

const App = () => {
    const [page, setPage] = useState("authors");
    const [token, setToken] = useState(null);

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
                            localStorage.setItem("user-token", null);
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
