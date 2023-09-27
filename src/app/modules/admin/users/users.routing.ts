import { Route } from '@angular/router';
import { UsersComponent } from './users.component';
import { UsersListComponent } from './list/list.component';
import { UsersDetailsComponent } from './details/details.component';
import { CanDeactivateUsersDetails } from './users.guards';
import { UsersResolver, UsersUserResolver } from './users.resolver';

export const usersRoutes : Route[] = [
    {
        path     : '',
        component: UsersComponent,
        children : [
            {
                path     : '',
                component : UsersListComponent,
                resolve   : {
                    tasks : UsersResolver
                },
                children : [
                    {
                        path          : ':id',
                        component     : UsersDetailsComponent,
                        resolve       : {
                            tasks: UsersUserResolver
                        },
                        canDeactivate : [CanDeactivateUsersDetails]
                    }
                ]
            }
        ]
    }
]
