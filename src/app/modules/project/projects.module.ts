import { NgModule } from "@angular/core";
import { ProjectsComponent } from "./projects.component";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { SharedModule } from "app/shared/shared.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSelectModule } from "@angular/material/select";
import { MatRippleModule } from "@angular/material/core";
import { projectRoutes } from "./projects.routing";
import { ProjectsListComponent } from "./list/list.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { ProjectsDetailsComponent } from "./details/details.component";
import {MatListModule} from '@angular/material/list';
import { TasksComponent } from "./common/tasks/task.component";
import { CommonsComponent } from "./common/common.component";
import { FuseNavigationModule } from "@fuse/components/navigation";
import { BoardsComponent } from "./common/boards/board.component";
import { TaskDetailsComponent } from "./common/tasks/tasks-details/details-task.component";
import { GanttComponent } from "./common/gantt/gantt.component";
import {MatSliderModule} from '@angular/material/slider';
import { SolutionsComponent } from "./common/solutions/solutions.component";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatDialogModule } from "@angular/material/dialog";
import { CorrectiveActionsDialog } from "./common/solutions/corrective-actions/actions.component";
import { AddActionDialog } from "./common/solutions/corrective-actions/add-action/add-action.component";
import { SolutionDetailsComponent } from "./common/solutions/solution-details/details.componen";

@NgModule({
    declarations: [
        ProjectsComponent,
        ProjectsListComponent,
        ProjectsDetailsComponent,
        CommonsComponent,
        TasksComponent,
        TaskDetailsComponent,
        BoardsComponent,
        GanttComponent,
        SolutionsComponent,
        SolutionDetailsComponent,
        CorrectiveActionsDialog,
        AddActionDialog
    ],
    imports:[
        RouterModule.forChild(projectRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        SharedModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatListModule,
        FuseNavigationModule,
        MatSliderModule,
        MatSortModule,
        MatTableModule,
        MatDialogModule
    ],
    providers : []
})
export class ProjectsModule{

}
