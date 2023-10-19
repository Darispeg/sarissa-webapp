import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { SolutionDetailsComponent } from "./solution-details/details.componen";

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateSolutionDetails implements CanDeactivate<SolutionDetailsComponent>
{
    canDeactivate(
        component: SolutionDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>
    {
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        if ( !nextState.url.includes('/solutions') )
        {
            return true;
        }

        if ( nextRoute.paramMap.get('idSolution') )
        {
            return true;
        }
        else
        {
            return component.closeDrawer().then(() => true);
        }
    }

}