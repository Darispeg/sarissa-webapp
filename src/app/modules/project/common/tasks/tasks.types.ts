import { ProjectCompletion, UserMember } from "../../projects.types";

export interface TaskDetails 
{
    id : string,
    title : string,
    description : string,
    parent : string,
    root_cause : string,
    source_action : string,
    status : string,
    progress : number,
    assigned_users : UserMember[],
    start_date : Date,
    task_completion: ProjectCompletion
}

export interface TaskRequestCreate 
{
    projectId : string,
    title : string,
    description : string,
    parent : string,
    root_cause : string,
    source_action : string,
    status : string,
    progress : number,
    assigned_users : string[],
    start_date : Date,
    task_completion: ProjectCompletion
}