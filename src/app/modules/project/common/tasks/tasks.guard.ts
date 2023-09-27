import { Injectable } from "@angular/core";
import { TaskDetailsComponent } from "./tasks-details/details-task.component";
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateTaskDetails implements CanDeactivate<TaskDetailsComponent>
{
    canDeactivate(
        component: TaskDetailsComponent,
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

        if ( !nextState.url.includes('/tasks') )
        {
            return true;
        }

        if ( nextRoute.paramMap.get('idTask') )
        {
            return true;
        }
        else
        {
            return component.closeDrawer().then(() => true);
        }
    }

}