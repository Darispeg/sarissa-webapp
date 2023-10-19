import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SolutionsService } from "../solutions.service";
import { CorrectiveActionsData } from "./actions.types";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { AddActionDialog } from "./add-action/add-action.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CorrectiveActions, SolutionInfo } from "../solutions.types";
import { catchError, takeUntil } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Component({
    selector: 'solution-actions',
    templateUrl: './actions.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorrectiveActionsDialog implements OnInit, OnDestroy
{
    @ViewChild('actionsTable', {read: MatSort}) actionsTableMatSort: MatSort;
    actionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    actionsTableColumns: string[] = ['why', 'evidence', 'comment', 'root_cause', 'remove']

    @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
        this.actionsDataSource.sort = sort;
    }

    solution : SolutionInfo;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        public dialogRef: MatDialogRef<CorrectiveActionsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: CorrectiveActionsData,
        private _solutionService: SolutionsService,
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this._solutionService.solutions$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._solutionService.corrective_actions$
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((data : CorrectiveActions[]) => {
                        this.actionsDataSource.data = data;
                    });
            })
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    updateMemberValidateSolution(validation: String) {
        this._solutionService.updateMemberValidateSolution(this.data.solution.id, this.data.member, validation)
        .pipe(
            catchError((error) => {
                this.snackBar(error, 'error')
                return throwError(error);
            })
        ).subscribe(() => {
            this.snackBar('Solucion [' + validation +'] satisfactoriamente', 'success');
        });;
    }

    addActionDialog() {
        this._dialog.open(AddActionDialog, {
            data: {solutionId: this.data.solution.id},
        });
    }

    removeCorrectiveAction(correctiveActionId : String) {
        this._solutionService.removeCorrectiveAction(this.data.solution.id, correctiveActionId)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe(() => {
                this.snackBar('Se elimino la accion correctiva satisfactoriamente', 'success');
            });
        this._solutionService.getSolutionByKey(this.data.solution.id).subscribe();
    }

    snackBar(message, type : string) {
        switch (type) {
            case 'success' :  this._snackBar.open('✅ ' + message, ' x ', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    panelClass: ['bg-green-50', 'text-green-700'],
                });
                break;
            case 'error' :  this._snackBar.open('❌ ' + message, ' x ', {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    panelClass: ['bg-green-50', 'text-green-700'],
                });
                break;
            default :  this._snackBar.open(message, ' x ', {
                duration: 3000,
                verticalPosition: 'bottom',
                panelClass: ['bg-blue-50', 'text-blue-700'],
            });
            break;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}