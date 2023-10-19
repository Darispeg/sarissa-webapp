import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { ApolloQueryResult } from "@apollo/client/core";
import { catchError } from "rxjs/operators";
import { SolutionsService } from "./solutions.service";

@Injectable({
    providedIn: 'root'
})
export class SolutionListResolver implements Resolve<any>
{
    constructor(private _solutionServive : SolutionsService)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ApolloQueryResult<Object>> | boolean
    {
        return this._solutionServive.getSolutionsByProjectId(localStorage.getItem('idProject'));
    }
}


@Injectable({
    providedIn: 'root'
})
export class SolutionDetailsResolver implements Resolve<any>
{
    constructor(private _solutionServive : SolutionsService,
                private _router: Router)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<ApolloQueryResult<Object>> | boolean
    {
        return this._solutionServive.getSolutionByKey(route.paramMap.get('idSolution'))
            .pipe(
                catchError((error) => {
                    const parentUrl = state.url.split('/').slice(0, -1).join('/');
                    this._router.navigateByUrl(parentUrl);
                    return throwError(error);
                })
            );
    }
}