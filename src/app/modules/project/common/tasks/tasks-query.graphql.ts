import gql from "graphql-tag"

const GET_TASKS_BY_PROJECT_ID = gql `
    query GetProject($getProjectId: ID) {
        getProject(id: $getProjectId) {
            id
            title
            tasks {
                id
                title
                parent 
                description
                status
                progress
                task_completion {
                    target_completion
                    actual_completion
                }
                start_date
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
            status
        }
    }
`

const GET_TASK_BY_ID = gql `
    query GetTask($getTaskId: ID) {
        getTask(id: $getTaskId) {
            id
            title
            description
            parent
            root_cause
            source_action
            status
            progress
            start_date
            task_completion {
                actual_completion
                target_completion
            }
            assigned_users {
                id
                name
                last_name
            }
        }
    }
`

const CREATE_TASK = gql`
    mutation CreateTask($taskRequest: TaskInput!) {
        createTask(task: $taskRequest) {
            id
            title
            description
            parent
            root_cause
            source_action
            status
            progress
            start_date
            task_completion {
                actual_completion
                target_completion
            }
            assigned_users {
                id
                name
                last_name
            }
        }
    }
`

const UPDATE_TASK_BY_ID = gql`
    mutation UpdateTask($updateTaskId: ID!, $taskRequest: TaskInput!) {
        updateTask(id: $updateTaskId, task: $taskRequest) {
            id
            title
            description
            parent
            root_cause
            source_action
            status
            progress
            start_date
            task_completion {
                actual_completion
                target_completion
            }
            assigned_users {
                id
                name
                last_name
            }
        }
    }
`

export { GET_TASKS_BY_PROJECT_ID, GET_TASK_BY_ID, CREATE_TASK, UPDATE_TASK_BY_ID }