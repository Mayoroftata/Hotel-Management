// lib/ApolloWrapper.js
"use client";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql",
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage
  const token = localStorage.getItem("token");

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export const ApolloWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
