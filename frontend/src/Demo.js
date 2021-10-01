import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_USERS = gql`
    {
        posts{
            id
            title
        }
    }
`

const Demo = () => {
    const { loading, error, data } = useQuery(GET_USERS);

    if(loading) return 'ロード中...'
    if(error) return `Error ${error.message}`
    return (
        <React.Fragment>
            {data.posts.map(post => (
                <div key={post.id}>
                    <h1>{post.title}</h1>
                </div>
            ))}
        </React.Fragment>
    )
}

export default Demo
