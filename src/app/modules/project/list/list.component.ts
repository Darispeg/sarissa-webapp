import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { BehaviorSubject, Observable, Subject, of } from "rxjs";
import { ProjectsService } from "../projects.service";
import { map, switchMap, takeUntil } from "rxjs/operators";
import moment from "moment";
import { MatDrawer } from "@angular/material/sidenav";
import { Project } from "../projects.types";
import { FormControl } from "@angular/forms";

@Component({
    selector       : 'project-board',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';

    projects$: Observable<any[]>;
    selectedProject: Project;
    searchProject$ = new BehaviorSubject<string>('');
    projectListFiltered = [];
    projects : Project[];

    searchInputControl: FormControl = new FormControl();
    isLoading: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _projectService: ProjectsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {}

    ngOnInit(): void {
        this.projects$ = this._projectService.projects$

        this._projectService.projects$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((projects: any[]) => {
                this.projects = projects;
                this._changeDetectorRef.markForCheck();
            });
        
        this._projectService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((project : Project) => {
                this.selectedProject = project;
                this._changeDetectorRef.markForCheck();
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                if ( matchingAliases.includes('lg') )
                    this.drawerMode = 'side';
                else
                    this.drawerMode = 'over';

                this._changeDetectorRef.markForCheck();
            });
        
        this.matDrawer.openedChange.subscribe((opened) => {
                if ( !opened )
                {
                    this.selectedProject = null;
                    this._changeDetectorRef.markForCheck();
                }
            });
        
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) => {
                    this.matDrawer.close();
                    this._router.navigate(['./'], {relativeTo: this._activatedRoute});
                    this.isLoading = true;
                    return this._projectService.filterProjects(query);
                }),
                map(() => {
                    this.isLoading = false;
                })
            )
            .subscribe(() => {
                this._changeDetectorRef.markForCheck();
                }
            );
    }
    
    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onBackdropClicked(): void
    {
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    formatDateAsRelative(date: string): string
    {
        return moment(date, moment.ISO_8601).fromNow();
    }

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    createProject() : void
    {
        this._router.navigate(['./000000000000000000000000'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    openProject(idProject : string) {
        localStorage.setItem('idProject', idProject);
        this._router.navigate(['./' + idProject + '/info'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }
}