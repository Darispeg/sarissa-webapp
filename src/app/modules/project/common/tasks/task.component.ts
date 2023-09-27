import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { ProjectsService } from "../../projects.service";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { CommonsComponent } from "../common.component";
import { FormControl } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { takeUntil } from "rxjs/operators";
import { Project, TaskInfo } from "../../projects.types";
import { TasksService } from "./tasks.service";
import { FuseNavigationService } from "@fuse/components/navigation";

@Component({
    selector       : 'common-tasks',
    templateUrl    : './task.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawerTask', {static: true}) matDrawerTask: MatDrawer;
    drawerTaskMode: 'side' | 'over';

    projects$: Observable<any>;
    project : Project;
    tasks$ : Observable<any>;
    selectedTask : TaskInfo;

    searchInputControl: FormControl = new FormControl();
    isLoading: boolean = false;

    tasksCount: any = {
        completed : 0,
        inProgress : 0,
        incomplete: 0,
        total     : 0
    };

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _commonsComponent : CommonsComponent,
        private _taskService: TasksService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _projectService: ProjectsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    )
    {}
    
    ngOnInit(): void {
        this._taskService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data : Project) => {
                this.project = data;
                this.tasksCount.total = data.tasks?.length | 0
                this.tasksCount.completed = data.tasks?.filter(i => i.status.toUpperCase() === 'FINISHED').length | 0;
                this.tasksCount.inProgress = data.tasks?.filter(i => i.status.toUpperCase() === 'IN_PROGRESS').length | 0;
                this.tasksCount.incomplete = data.tasks?.filter(i => i.status.toUpperCase() === 'UNFINISHED').length | 0;
            });
        
        this.tasks$ = this._taskService.tasks$;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleDrawer(): void
    {
        this._commonsComponent.matDrawer.toggle();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    createTask() {
        this._router.navigate(['./000000000000000000000000'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }
}