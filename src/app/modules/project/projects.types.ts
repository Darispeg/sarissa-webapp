export interface Project 
{
    id?: string
    title: string
    description: string
    tasks? : TaskInfo[]
    organizer: UserMember
    members?: UserMember[]
    project_completion: ProjectCompletion
    modified?: Date
    icon?: string
    status: string
}

export interface UserMember 
{
    id: string
    name: string
    last_name: string
}

export interface ProjectCompletion
{
    target_completion: Date
    actual_completion: Date
}

export interface ProjectRequestCreate
{
    title: string
    description: string
    organizer: string
    members: string[]
    project_completion: ProjectCompletion
    icon?: string
    status: string
}

export interface TaskInfo 
{
    id : string,
    parent : string,
    title : string,
    description : string,
    status : string,
    progress : number,
    task_completion: ProjectCompletion
    start_date: string
}

