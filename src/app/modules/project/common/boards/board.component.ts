import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { Subject } from "rxjs";
import { ProjectsService } from "../../projects.service";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { CommonsComponent } from "../common.component";

@Component({
    selector       : 'common-board',
    templateUrl    : './board.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardsComponent implements OnInit, OnDestroy
{
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _commonsComponent : CommonsComponent,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _projectService: ProjectsService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
    )
    {}
    
    ngOnInit(): void {
        console.log('board');
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    toggleDrawer(): void
    {
        this._commonsComponent.matDrawer.toggle();
    }
}