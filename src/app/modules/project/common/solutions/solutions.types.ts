import { UserMember } from "../../projects.types"

export interface SolutionInfo 
{
    id : string,
    title : string,
    description : string,
    trigger : string,
    created : string,
    modified : string,
    status : string,
    organizer : MemberSolution,
    members : MemberSolution[]
    corrective_actions : CorrectiveActions[]
}

export interface MemberSolution 
{
    member : string,
    role : string,
    validation : string
}

export interface CorrectiveActions 
{
    id : string
    why : string
    root_cause : boolean
    evidence : string
    comment : string
}

export interface SolutionDetails 
{
    id : string,
    title : string,
    description : string,
    trigger : string,
    created : string,
    modified : string,
    status? : string,
    members : MemberDetailSolution[]
    corrective_actions : CorrectiveActions[]
}

export interface MemberDetailSolution 
{
    member? : UserMember,
    role : string,
    validation : string
}

export interface SolutionDetailsRequest 
{
    title: String,
    trigger: String,
    description: String,
    projectId: String,
    organizer: String,
    members: MemberSolution[]
}