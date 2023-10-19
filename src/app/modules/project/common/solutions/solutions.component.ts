import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { CommonsComponent } from "../common.component";
import { FormControl } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { takeUntil } from "rxjs/operators";
import { Project } from "../../projects.types";
import { SolutionsService } from "./solutions.service";
import { SolutionInfo } from "./solutions.types";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CorrectiveActionsDialog } from "./corrective-actions/actions.component";

@Component({
    selector       : 'common-solutions',
    templateUrl    : './solutions.component.html',
    styleUrls: ['./solutions.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionsComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawerSolution', {static: true}) matDrawerSolution: MatDrawer;
    drawerSolutionMode: 'side' | 'over';

    @ViewChild('solutionTable', {read: MatSort}) solutionTableMatSort: MatSort;
    solutionDataSource: MatTableDataSource<any> = new MatTableDataSource();
    solutionTableColumns: string[] = ['created', 'trigger', 'title', 'modified', 'calification', 'operator', 'technician', 'supervisor', 'specialist', 'area_manager']

    @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
        this.solutionDataSource.sort = sort;
    }

    project : Project;
    solutions$ : Observable<any>;
    selectedSolution : SolutionInfo;

    searchInputControl: FormControl = new FormControl();
    isLoading: boolean = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _commonsComponent : CommonsComponent,
        private _solutionService: SolutionsService,
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _dialog: MatDialog
    )
    {}
    
    ngOnInit(): void {
        this._solutionService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data : Project) => {
                this.project = data;
            });
        
        this.solutions$ = this._solutionService.solutions$;

        this._solutionService.solutions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((solutions: SolutionInfo[]) => {
                this.solutionDataSource.data = solutions;
                this._changeDetectorRef.markForCheck();
            })
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

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    findStatusForMember(solution: SolutionInfo, role: string) : String {
        return solution.members.find(i => i.role.toUpperCase() === role.toUpperCase()).validation;
    }

    createAnalysis() {
        this._router.navigate(['./000000000000000000000000'], {relativeTo: this._activatedRoute});
        this._changeDetectorRef.markForCheck();
    }

    findMemberKeyForRole(solution: SolutionInfo, role: string) : String {
        return solution.members.find(i => i.role.toUpperCase() === role.toUpperCase()).member;
    }

    openCorrectiveActionsDialog(solution: SolutionInfo, role: string) {
        var memberKey = this.findMemberKeyForRole(solution, role);
        
        this._solutionService.findCorrectiveActionsBySolutionId(solution.id);
        
        this._dialog.open(CorrectiveActionsDialog, {
            data: {solution: solution, member: memberKey},
        });
    }

    calculateCalification(solution: SolutionInfo){
        return solution.members.filter(i => i.validation === 'ACCEPTED').length;
    }
}