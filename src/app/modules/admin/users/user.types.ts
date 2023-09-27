export interface User
{
    id? : string
    ci: string
    name: string
    last_name: string
    phone: string
    email: string
    role: string
    status: string
    position: string
    password?: string 
    created?: Date
    birthday?: Date
}

export interface UserCreateRequest 
{
    ci: string
    name: string
    last_name: string
    phone: string
    email: string
    role: string
    status: string
    position: string
    password? : string
    birthday?: Date
}