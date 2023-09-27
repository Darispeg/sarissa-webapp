import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { ProjectsDetailsComponent } from "./details/details.component";

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateProjectsDetails implements CanDeactivate<ProjectsDetailsComponent>
{
    canDeactivate(
        component: ProjectsDetailsComponent,
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

        if ( !nextState.url.includes('/projects') )
        {
            return true;
        }

        if ( nextRoute.paramMap.get('id') )
        {
            return true;
        }
        else
        {
            return component.closeDrawer().then(() => true);
        }
    }

}