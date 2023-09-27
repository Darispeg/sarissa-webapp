import gql from "graphql-tag"

const GET_USERS = gql`
    query {
        getAllUsers {
            id
            ci
            name
            last_name
            phone
            email
            role
            status
            position
            birthday
            password
          }
    }
`

const GET_USER_BY_KEY = gql`
    query GetUser($userId: ID) {
        getUser(id: $userId) {
            id
            ci
            name
            last_name
            phone
            email
            role
            status
            position
            birthday
            password
        }
    }
`

const CREATE_USER = gql`
    mutation CreateUser($userRequest: UserInput!) {
        createUser(user: $userRequest) {
            id
            ci
            name
            last_name
            phone
            email
            role
            status
            position
            birthday
            password
        }
    }
`

const UPDATE_USER_BY_ID = gql`
    mutation UpdateUser($updateUserId: ID!, $userRequest: UserInput!) {
        updateUser(user: $userRequest, id: $updateUserId)  {
            id
            ci
            name
            last_name
            phone
            email
            role
            status
            position
            birthday
            password
        }
    }
`

export { GET_USERS, GET_USER_BY_KEY, CREATE_USER, UPDATE_USER_BY_ID }