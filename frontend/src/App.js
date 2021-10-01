import React from 'react'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import Demo from './Demo';
import AddPost from './AddPost';
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql'
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <AddPost />
        <Demo />
      </div>
    </ApolloProvider>
  );
}

export default App;
