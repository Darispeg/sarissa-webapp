import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SolutionsService } from "../../solutions.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";

@Component({
    selector: 'solution-add-actions',
    templateUrl: './add-action.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddActionDialog
{
    actionForm = new FormGroup({
        why : new FormControl('', Validators.required),
        evidence : new FormControl('', Validators.required),
        comment : new FormControl(''),
        root_cause : new FormControl(false, Validators.required),
        user_validation : new FormControl([])
    });

    constructor(
        public dialogRef: MatDialogRef<AddActionDialog>,
        @Inject(MAT_DIALOG_DATA) public solutionId: any,
        private _solutionService: SolutionsService,
        private _snackBar: MatSnackBar
    ) {}

    addCorrectiveAction() {
        this._solutionService.addCorrectiveAction(this.solutionId.solutionId, this.actionForm.getRawValue())
        .pipe(
            catchError((error) => {
                this.snackBar(error, 'error')
                return throwError(error);
            })
        ).subscribe(() => {
            this.snackBar('Se agrego la accion correctiva satisfactoriamente', 'success');
        });
        this._solutionService.getSolutionByKey(this.solutionId.solutionId).subscribe();
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