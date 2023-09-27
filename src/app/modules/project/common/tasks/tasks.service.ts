import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { TaskDetails, TaskRequestCreate } from "./tasks.types";
import { CREATE_TASK, GET_TASKS_BY_PROJECT_ID, GET_TASK_BY_ID, UPDATE_TASK_BY_ID } from "./tasks-query.graphql";
import { catchError, map, switchMap, take, tap } from "rxjs/operators";
import { Project, TaskInfo } from "../../projects.types";
import { ApolloQueryResult } from "@apollo/client/core";

@Injectable({
    providedIn: 'root'
})
export class TasksService
{
    private _task: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _tasks: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _project : BehaviorSubject<Project | null> = new BehaviorSubject(null);
    private _new: string = '000000000000000000000000';

    constructor(private _apollo: Apollo){}

    get project$(): Observable<Project>
    {
        return this._project.asObservable();
    }

    get task$(): Observable<TaskDetails>
    {
        return this._task.asObservable();
    }

    get tasks$(): Observable<TaskInfo[]>
    {
        return this._tasks.asObservable();
    }

    getTaskByKey(id: String): Observable<any>
    {
        if(id === this._new)
        {
            return this._tasks.pipe(
                take(1),
                map(() => {
                    const task : TaskDetails = {
                        id : '',
                        title: '',
                        description: '',
                        parent  : null,
                        start_date : new Date(),
                        task_completion : {
                            target_completion : new Date(),
                            actual_completion : null
                        },
                        assigned_users : [],
                        status : 'IN_PROGRESS',
                        root_cause : '',
                        source_action : '',
                        progress : 1
                    };
                    this._task.next(task);
                    return task;
                })
            );
        }

        return this._apollo.query({
                query: GET_TASK_BY_ID,
                variables: {
                    getTaskId: id
                },
            }).pipe(
                tap((result: any) => {
                    this._task.next(result.data?.getTask);
                })
            );
    }

    getTasksByProjectId(id: string): Observable<ApolloQueryResult<Object>>
    {
        return this._apollo.query({
                    query: GET_TASKS_BY_PROJECT_ID,
                    variables: {
                        getProjectId: id
                    },
                }).pipe(
                    tap((result: any) => {
                        this._project.next(result.data?.getProject);
                        this._tasks.next(result.data?.getProject.tasks);
                    })
                );
    }

    createTask(task: any) : Observable<any> {
        const newTask : TaskRequestCreate = {
            projectId : this._project.value.id,
            parent : task.parent,
            title : task.title,
            description : task.description,
            source_action : task.source_action,
            root_cause : task.root_cause,
            start_date : task.start_date,
            task_completion : {
                target_completion : task.task_completion.target_completion,
                actual_completion : null
            },
            assigned_users : [],
            status : task.status,
            progress : task.progress.toString(),
        };

        task.assigned_users.forEach(user => {
            newTask.assigned_users.push(user.id);
        });

        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._apollo.mutate({
                mutation: CREATE_TASK,
                variables: {
                    taskRequest: newTask
                },
            }).pipe(
                map((result: any) => {
                    this._tasks.next([result.data?.createTask, ...tasks]);
                    return result.data?.createTask;
                })
            ))
        )
    };

    updateTask(id: string, task: any) : Observable<any> {
        const updateTask : TaskRequestCreate = {
            projectId : this._project.value.id,
            parent : task.parent,
            title : task.title,
            description : task.description,
            source_action : task.source_action,
            root_cause : task.root_cause,
            start_date : task.start_date,
            task_completion : {
                target_completion : task.task_completion.target_completion,
                actual_completion : null
            },
            assigned_users : [],
            status : task.status,
            progress : task.progress.toString(),
        };

        task.assigned_users.forEach(user => {
            updateTask.assigned_users.push(user.id);
        });
        
        return this.tasks$.pipe(
            take(1),
            switchMap(tasks => this._apollo.mutate({
                mutation: UPDATE_TASK_BY_ID,
                variables: {
                    updateTaskId: id,
                    taskRequest: updateTask
                },
            }).pipe(
                map((result: any) => {
                    this._task.next(result.data?.updateTask);
                    return result.data?.updateTask;
                }),
                catchError((error) => {
                    return throwError(error);
                })
            ))
        );
    }
}