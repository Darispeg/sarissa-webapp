import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDrawer } from "@angular/material/sidenav";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { FuseMediaWatcherService } from "@fuse/services/media-watcher";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ProjectsService } from "../projects.service";
import { Project } from "../projects.types";

@Component({
    selector       : 'common-components',
    templateUrl    : './common.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommonsComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    drawerOpened: boolean;
    menuData: FuseNavigationItem[];

    project : Project;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService
    )
    {
        this.menuData = [
            {
                id      : 'project.common',
                title   : 'Proyecto',
                subtitle: 'Informacion del proyecto',
                type    : 'group',
                children: [
                    {
                        id   : 'project.common.tasks',
                        title: 'Tareas',
                        type : 'basic',
                        link : '../info/common/tasks',
                        icon : 'feather:target',
                    },
                    {
                        id   : 'project.common.boards',
                        title: 'Tablero',
                        type : 'basic',
                        link : '../info/common/boards',
                        icon : 'heroicons_solid:view-boards',
                    },
                    {
                        id   : 'project.common.gantt',
                        title: 'Gantt',
                        type : 'basic',
                        link : '../info/common/gantt',
                        icon : 'heroicons_solid:table',
                    },
                ]
            }
        ];
    }

    ngOnInit(): void
    {
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                if ( matchingAliases.includes('md') )
                {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else
                {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
