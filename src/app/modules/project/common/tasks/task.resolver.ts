import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { TasksService } from "./tasks.service";
import { Observable, throwError } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TaskListResolver implements Resolve<any>
{
    constructor(private _taskServive : TasksService)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ApolloQueryResult<Object>> | boolean
    {
        return this._taskServive.getTasksByProjectId(localStorage.getItem('idProject'));
    }
}

@Injectable({
    providedIn: 'root'
})
export class TaskDetailsResolver implements Resolve<any>
{
    constructor(private _taskServive : TasksService,
                private _router: Router)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ApolloQueryResult<Object>> | boolean
    {
        return this._taskServive.getTaskByKey(route.paramMap.get('idTask'))
            .pipe(
                catchError((error) => {
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');
                    this._router.navigateByUrl(parentUrl);
                    return throwError(error);
                })
            );
    }
}
