import { useEffect, useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";
import Recommended from "./components/Recommended";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";

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

    const menu = {
        authors: "alwaysShow",
        books: "alwaysShow",
        add: "restrict",
        recommended: "restrict",
        logout: "restrict",
        login: "notLogged",
    };

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            console.log(subscriptionData.data.bookAdded.title);
            alert(`book - ${subscriptionData.data.bookAdded.title} was added`);
            client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
                return {
                    allBooks: allBooks.concat(subscriptionData.data.bookAdded),
                };
            });
        },
    });

    return (
        <div>
            <div>
                {Object.entries(menu).map(([key, value]) =>
                    value === "alwaysShow" ||
                    (value === "notLogged" && !token) ||
                    (value === "restrict" && token) ? (
                        <button
                            key={key}
                            className={page === key ? "selected-tab" : null}
                            onClick={() => {
                                if (key === "logout") {
                                    setToken(null);
                                    localStorage.clear();
                                    client.resetStore();
                                    setPage("login");
                                } else setPage(key);
                            }}
                        >
                            {key}
                        </button>
                    ) : null
                )}
            </div>

            <Authors token={token} show={page === "authors"} />
            <Books show={page === "books"} />
            <NewBook show={page === "add"} />
            <Recommended show={page === "recommended"} />
            <Login
                setPage={setPage}
                setToken={setToken}
                show={page === "login"}
            />
        </div>
    );
};

export default App;
