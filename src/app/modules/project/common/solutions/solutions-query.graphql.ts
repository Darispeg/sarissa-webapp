import gql from "graphql-tag"

const GET_SOLUTIONS_BY_PROJECT_ID = gql `
    query GetProject($getProjectId: ID) {
        getProject(id: $getProjectId) {
            id
            title
            members {
                id
                name
                last_name
            }
            solutions {
                id
                title
                trigger
                created
                modified
                members {
                    member
                    role
                    validation
                }
                corrective_actions {
                    id
                    why
                    root_cause
                    evidence
                    comment
                }
            }
        }
    }
`

const GET_SOLUTION_BY_ID = gql `
    query GetSolution($getSolutionId: ID) {
        getSolution(id: $getSolutionId) {
            id
            title
            trigger
            description
            created
            modified
            organizer {
                id,
                name,
                last_name
            }
            members {
                member {
                    id,
                    name,
                    last_name
                }
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`

const CREATE_SOLUTION = gql`
    mutation createSolution($solutionRequest: SolutionInput!) {
        createSolution(solution: $solutionRequest) {
            id
            title
            trigger
            created
            modified
            description
            organizer {
                id,
                name,
                last_name
            }
            members {
                member {
                    id,
                    name,
                    last_name
                }
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`

const UPDATE_SOLUTION_BY_ID = gql`
    mutation UpdateSolution($updateSolutionId: ID!, $solutionRequest: SolutionInput!) {
        updateSolution(id: $updateSolutionId, solution: $solutionRequest) {
            id
            title
            trigger
            created
            modified
            description
            organizer {
                id,
                name,
                last_name
            }
            members {
                member {
                    id,
                    name,
                    last_name
                }
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`

const UPDATE_MEMBER_VALIDATE_SOLUTION = gql`
    mutation UpdateMemberValidation($solutionId: ID!, $memberId: ID!, $updateValidation: String) {
        updateMemberValidation(solutionId: $solutionId, memberId: $memberId, updateValidation: $updateValidation) {
            id
            title
            trigger
            description
            created
            modified
            members {
                member
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`


const ADD_CORRECTIVE_ACTION_TO_SOLUTION = gql`
    mutation AddCorrectiveAction($solutionId: ID!, $action: ActionInput!) {
        addCorrectiveAction(solutionId: $solutionId, action: $action) {
            id
            title
            trigger
            description
            created
            modified
            members {
                member
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`

const REMOVE_CORRECTIVE_ACTION_TO_SOLUTION = gql`
    mutation RemoveCorrectiveAction($solutionId: ID!, $actionId: ID!) {
        removeCorrectiveAction(solutionId: $solutionId, actionId: $actionId) {
            id
            title
            trigger
            description
            created
            modified
            members {
                member
                role
                validation
            }
            corrective_actions {
                id
                why
                root_cause
                evidence
                comment
            }
        }
    }
`

export { GET_SOLUTIONS_BY_PROJECT_ID, GET_SOLUTION_BY_ID, CREATE_SOLUTION, UPDATE_SOLUTION_BY_ID, UPDATE_MEMBER_VALIDATE_SOLUTION, ADD_CORRECTIVE_ACTION_TO_SOLUTION, REMOVE_CORRECTIVE_ACTION_TO_SOLUTION }