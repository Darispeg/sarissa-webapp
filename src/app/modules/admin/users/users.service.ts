import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { CREATE_USER, GET_USERS, UPDATE_USER_BY_ID } from "./queries.graphql";
import { User, UserCreateRequest } from "./user.types";
import { filter, map, switchMap, take, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UsersService
{
    private _user: BehaviorSubject<User | null> = new BehaviorSubject(null);
    private _users: BehaviorSubject<any[] | null> = new BehaviorSubject(null);

    private _new: string = '000000000000000000000000';

    constructor(private _apollo: Apollo){}

    get user$(): Observable<User>
    {
        return this._user.asObservable();
    }

    get users$(): Observable<any[]>
    {
        return this._users.asObservable();
    }

    getUsers(): void
    {
        this._apollo.watchQuery({
            query: GET_USERS
        })
        .valueChanges.subscribe((result : any) => {
            const users = result.data?.getAllUsers;
            this._users.next(users);
        });
    }
    
    getUserByKey(id: String): Observable<User> 
    {
        if(id === this._new)
        {
            return this._users.pipe(
                take(1),
                map(() => {
                    const user : User = {
                        id : '',
                        name: '',
                        last_name: '',
                        ci: '',
                        email: '',
                        phone: '',
                        status: 'active',
                        role: '',
                        position: '',
                        password: ''
                    };
                    this._user.next(user);
                    return user;
                })
            );
        }

        return this._users.pipe(
            take(1),
            map((users) => {
                const area = users.find(user => user['id'] ===  id) || null;
                this._user.next(area);
                return area;
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

    createUser(user: UserCreateRequest) : Observable<any> {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._apollo.mutate({
                mutation: CREATE_USER,
                refetchQueries: [{ query: GET_USERS }],
                variables: {
                    userRequest: user
                },
            }).pipe(
                map((result: any) => {
                    this._users.next([result.data?.createUser, ...users]);
                    return result.data?.createUser;
                })
            ))
        )
    }

    updateUser(id: string, user: UserCreateRequest) : Observable<any> {
        return this.users$.pipe(
            take(1),
            switchMap(users => this._apollo.mutate({
                mutation: UPDATE_USER_BY_ID,
                refetchQueries: [{ query: GET_USERS }],
                variables: {
                    updateUserId: id,
                    userRequest: user
                },
            }).pipe(
                map((result: any) => {
                    this._user.next(result.data?.updateUser);
                    return result.data?.updateUser;
                })
            ))
        );
    }
}