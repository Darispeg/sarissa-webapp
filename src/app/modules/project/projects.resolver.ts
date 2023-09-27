import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { ProjectsService } from "./projects.service";
import { Project } from "./projects.types";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { TasksService } from "./common/tasks/tasks.service";


@Injectable({
    providedIn: 'root'
})
export class ProjectsResolver implements Resolve<any>
{
    constructor(private _projectService: ProjectsService)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        return this._projectService.getProjects().subscribe();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ProjectsDetailsResolver implements Resolve<any>
{
    constructor(
        private _projectService: ProjectsService,
        private _router: Router
    ){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Project>
    {
        return this._projectService.getProjectByKey(route.paramMap.get('id'))
                .pipe(
                    catchError((error) => {
                        const parentUrl = state.url.split('/').slice(0, -1).join('/');
                        this._router.navigateByUrl(parentUrl);
                        return throwError(error);
                    })
                );
    }
}
