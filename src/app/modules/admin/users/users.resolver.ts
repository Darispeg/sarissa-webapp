import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { UsersService } from './users.service';
import { Observable, throwError } from 'rxjs';
import { User } from './user.types';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsersResolver implements Resolve<any>
{
    constructor(private _userService: UsersService)
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any
    {
        this._userService.getUsers();
    }
}


@Injectable({
    providedIn: 'root'
})
export class UsersUserResolver implements Resolve<any>
{
    constructor(
        private _userService: UsersService,
        private _router: Router
    )
    {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>
    {
        return this._userService.getUserByKey(route.paramMap.get('id'))
                .pipe(
                    catchError((error) => {
                        console.error(error);
                        // Get the parent url
                        const parentUrl = state.url.split('/').slice(0, -1).join('/');

                        // Navigate to there
                        this._router.navigateByUrl(parentUrl);

                        // Throw an error
                        return throwError(error);
                    })
                );
    }
}

