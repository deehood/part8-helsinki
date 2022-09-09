import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { useApolloClient, useSubscription } from "@apollo/client";

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

    const menu = ["authors", "books", "add", "recommended", "login", "logout"];

    return (
        <div>
            <div>
                <button
                    className={page === menu[0] ? "selected-tab" : null}
                    onClick={() => setPage(menu[0])}
                >
                    {menu[0]}
                </button>
                <button
                    className={page === menu[1] ? "selected-tab" : null}
                    onClick={() => setPage(menu[1])}
                >
                    {menu[1]}
                </button>

                {token && (
                    <>
                        <button
                            className={page === menu[2] ? "selected-tab" : null}
                            onClick={() => setPage(menu[2])}
                        >
                            {menu[2]} book
                        </button>
                        <button
                            className={page === menu[3] ? "selected-tab" : null}
                            onClick={() => setPage(menu[3])}
                        >
                            {menu[3]}
                        </button>
                    </>
                )}

                {!token ? (
                    <button
                        className={page === menu[4] ? "selected-tab" : null}
                        onClick={() => setPage(menu[4])}
                    >
                        {menu[4]}
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setToken(null);
                            localStorage.clear();
                            client.resetStore();
                            setPage("login");
                        }}
                    >
                        logout
                    </button>
                )}
            </div>

            <Authors token={token} show={page === menu[0]} />
            <Books show={page === menu[1]} />
            <NewBook show={page === menu[2]} />
            <Recommended show={page === menu[3]} />
            <Login
                setPage={setPage}
                setToken={setToken}
                show={page === menu[4]}
            />
        </div>
    );
};

export default App;
