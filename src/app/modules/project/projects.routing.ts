import { Route } from "@angular/router";
import { ProjectsListComponent } from "./list/list.component";
import { ProjectsResolver, ProjectsDetailsResolver } from "./projects.resolver";
import { ProjectsComponent } from "./projects.component";
import { ProjectsDetailsComponent } from "./details/details.component";
import { CanDeactivateProjectsDetails } from "./projects.guard";
import { UsersResolver } from "../admin/users/users.resolver";
import { TasksComponent } from "./common/tasks/task.component";
import { CommonsComponent } from "./common/common.component";
import { BoardsComponent } from "./common/boards/board.component";
import { TaskDetailsResolver, TaskListResolver } from "./common/tasks/task.resolver";
import { TaskDetailsComponent } from "./common/tasks/tasks-details/details-task.component";
import { CanDeactivateTaskDetails } from "./common/tasks/tasks.guard";
import { GanttComponent } from "./common/gantt/gantt.component";
import { SolutionsComponent } from "./common/solutions/solutions.component";
import { SolutionDetailsResolver, SolutionListResolver } from "./common/solutions/solutions.resolver";
import { SolutionDetailsComponent } from "./common/solutions/solution-details/details.componen";
import { CanDeactivateSolutionDetails } from "./common/solutions/solutions.guard";


export const projectRoutes: Route[] = [
    {
        path     : '',
        component: ProjectsComponent,
        children : [
            {
                path        : '',
                component   : ProjectsListComponent,
                resolve     : {
                    projects : ProjectsResolver
                },
                children    : [
                    {
                        path    : ':id',
                        component : ProjectsDetailsComponent,
                        resolve   : {
                            projects : ProjectsDetailsResolver, UsersResolver
                        },
                        canDeactivate : [CanDeactivateProjectsDetails],
                    }
                ]
            },
            {
                path    : ':id/info',
                component : CommonsComponent,
                children : [
                    {
                        path      : '',
                        pathMatch : 'full',
                        redirectTo: 'common/tasks'
                    },
                    {
                        path    : 'common',
                        children: [
                            {
                                path      : '',
                                pathMatch : 'full',
                                redirectTo: 'tasks'
                            },
                            {
                                path     : 'tasks',
                                component: TasksComponent,
                                resolve     : {
                                    tasks : TaskListResolver
                                },
                                children    : [
                                    {
                                        path    : ':idTask',
                                        component : TaskDetailsComponent,
                                        resolve     : {
                                            task : TaskDetailsResolver
                                        },
                                        canDeactivate : [CanDeactivateTaskDetails],
                                    }
                                ]
                            },
                            {
                                path     : 'solutions',
                                component: SolutionsComponent,
                                resolve     : {
                                    tasks : SolutionListResolver
                                },
                                children    : [
                                    {
                                        path    : ':idSolution',
                                        component : SolutionDetailsComponent,
                                        resolve     : {
                                            task : SolutionDetailsResolver
                                        },
                                        canDeactivate : [CanDeactivateSolutionDetails],
                                    }
                                ]
                            },
                            {
                                path     : 'boards',
                                component: BoardsComponent,
                            },
                            {
                                path     : 'gantt',
                                component: GanttComponent,
                                resolve     : {
                                    tasks : TaskListResolver
                                },
                            },
                        ]
                    },
                ]
            }
        ]
    },
];
