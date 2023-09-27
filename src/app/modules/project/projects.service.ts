import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { CREATE_PROJECT, GET_PROJECTS, UPDATE_PROJECT_BY_ID } from "./query.graphql";
import { Project, ProjectRequestCreate } from "./projects.types";

@Injectable({
    providedIn: 'root'
})
export class ProjectsService
{
    private _project: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _projects: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private _new: string = '000000000000000000000000';

    constructor(private _apollo: Apollo){}

    get project$(): Observable<Project>
    {
        return this._project.asObservable();
    }

    get projects$(): Observable<any[]>
    {
        return this._projects.asObservable();
    }

    getProjects(): Observable<any>
    {
        return this._apollo.watchQuery({
                    query: GET_PROJECTS
                }).valueChanges.pipe(
                    tap((result: any) => {
                        this._projects.next(result.data?.getAllProject);
                    })
                );
    }
    
    getProjectByKey(id: String): Observable<Project> 
    {
        if(id === this._new)
        {
            return this._projects.pipe(
                take(1),
                map(() => {
                    const project : Project = {
                        id : '',
                        title: '',
                        description: '',
                        organizer : {
                            id : '',
                            name : '',
                            last_name : ''
                        },
                        project_completion : {
                            target_completion : new Date(),
                            actual_completion : null
                        },
                        members : [],
                        status : 'IN_PROGRESS'
                    };
                    this._project.next(project);
                    return project;
                })
            );
        }

        return this._projects.pipe(
            take(1),
            map((projects) => {
                const project = projects.find(project => project['id'] ===  id) || null;
                this._project.next(project);
                return project;
            }),
            switchMap((user) => {
                if ( !user )
                {
                    return throwError(`No se pudo encontrar al usuario con la clave ${id}!`);
                }
                return of(user);
            })
        );
    }

    createProject(project: any) : Observable<any> {
        const newProject : ProjectRequestCreate = {
            organizer : project.organizer,
            title : project.title,
            description : project.description,
            project_completion : {
                target_completion : project.project_completion.target_completion,
                actual_completion : null
            },
            icon : project.icon,
            members : [],
            status : project.status
        };

        project.members.forEach(member => {
            newProject.members.push(member.id);
        });

        return this.projects$.pipe(
            take(1),
            switchMap(projects => this._apollo.mutate({
                mutation: CREATE_PROJECT,
                refetchQueries: [{ query: GET_PROJECTS }],
                variables: {
                    projectRequest: newProject
                },
            }).pipe(
                map((result: any) => {
                    this._projects.next([result.data?.createProject, ...projects]);
                    return result.data?.createProject;
                })
            ))
        )
    };

    updateProject(id: string, project: any) : Observable<any> {
        const updateProject : ProjectRequestCreate = {
            organizer : project.organizer,
            title : project.title,
            description : project.description,
            project_completion : {
                target_completion : project.project_completion.target_completion,
                actual_completion : null
            },
            icon : project.icon,
            members : [],
            status : project.status
        };
        
        project.members.forEach(member => {
            updateProject.members.push(member.id);
        });
        
        return this.projects$.pipe(
            take(1),
            switchMap(projects => this._apollo.mutate({
                mutation: UPDATE_PROJECT_BY_ID,
                refetchQueries: [{ query: GET_PROJECTS }],
                variables: {
                    updateProjectId: id,
                    projectRequest: updateProject
                },
            }).pipe(
                map((result: any) => {
                    this._project.next(result.data?.updateProject);
                    return result.data?.updateProject;
                }),
                catchError((error) => {
                    return throwError(error);
                })
            ))
        );
    }

    filterProjects(term : string) : Observable<any> {
        return this._apollo.watchQuery({
            query: GET_PROJECTS
        }).valueChanges.pipe(
            tap((result: any) => {
                const listProject = result.data?.getAllProject;
                const listProjectFilter = listProject.filter(item => item.title.toLowerCase().indexOf(term.toLowerCase()) >= 0);
                this._projects.next(listProjectFilter);
            })
        );
    }
}