import gql from "graphql-tag"

const GET_PROJECTS = gql `
    query GetAllProject {
        getAllProject {
            id
            title
            description
            tasks {
                id
                title
                description
                status
                progress
            }
            organizer {
                id
                name
                last_name
                role
            }
            members {
                id
                name
                last_name
            }
            project_completion {
                target_completion
                actual_completion
            }
            modified
            icon
            status
        }
    }
`

const GET_PROJECT_BY_ID = gql `
    query GetProject($getProjectId: ID) {
        getProject(id: $getProjectId) {
            id
            title
            description
            tasks {
                id
                title
                description
                status
                progress
            }
            organizer {
                id
                name
                last_name
                role
            }
            members {
                id
                name
                last_name
            }
            project_completion {
                target_completion
                actual_completion
            }
            modified
            icon
            status
        }
    }
`

const CREATE_PROJECT = gql`
    mutation CreateProject($projectRequest: ProjectInput!) {
        createProject(project: $projectRequest) {
            id
            title
            description
            organizer {
                id
                name
                last_name
            }
            members {
                id
                name
                last_name
            }
            project_completion {
                target_completion
                actual_completion
            }
            modified
            icon
            status
        }
    }
`

const UPDATE_PROJECT_BY_ID = gql`
    mutation UpdateProject($updateProjectId: ID!, $projectRequest: ProjectInput!) {
        updateProject(id: $updateProjectId, project: $projectRequest) {
            id
            title
            description
            organizer {
                id
                name
                last_name
            }
            members {
                id
                name
                last_name
            }
            project_completion {
                target_completion
                actual_completion
            }
            modified
            icon
            status
        }
    }
`

export { GET_PROJECTS, GET_PROJECT_BY_ID, CREATE_PROJECT, UPDATE_PROJECT_BY_ID }