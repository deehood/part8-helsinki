import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const authLink = setContext(async (_, { headers }) => {
    const token = await localStorage.getItem("user-token");

    return {
        headers: {
            ...headers,
            authorization: token ? `bearer ${token}` : null,
        },
    };
});

const httpLink = new HttpLink({
    uri: "http://localhost:4000",
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

const root = createRoot(document.getElementById("root"));
root.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
