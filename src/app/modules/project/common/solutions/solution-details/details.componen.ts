import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { Subject, throwError } from "rxjs";
import { SolutionsComponent } from "../solutions.component";
import { SolutionsService } from "../solutions.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, ActivatedRoute } from "@angular/router";
import { Overlay } from "@angular/cdk/overlay";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { catchError, elementAt, takeUntil } from "rxjs/operators";
import { SolutionDetails } from "../solutions.types";
import { Project, UserMember } from "app/modules/project/projects.types";

@Component({
    selector       : 'project-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolutionDetailsComponent implements OnInit, OnDestroy
{
    solutionForm: FormGroup;
    solution : SolutionDetails ;
    editMode: boolean = false;
    matcher = new MyErrorStatusMatcher();
    users: UserMember[];
    selectedUsers: { [role: string]: string } = {};

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _solutionComponent : SolutionsComponent,
        private _solutionService : SolutionsService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _router: Router, 
        private _activatedRoute: ActivatedRoute,
        private _overlay: Overlay,
        private _renderer2: Renderer2,
        private _viewContainerRef: ViewContainerRef,
        private _snackBar: MatSnackBar
    ){}

    ngOnInit(): void {
        this._solutionComponent.matDrawerSolution.open();

        this.solutionForm = this._formBuilder.group({
            id: [''],
            title: ['', Validators.required],
            trigger: ['', Validators.required],
            description: ['', Validators.required],
            organizer : this.createOrganizeGroup(),
            members: this._formBuilder.group({
                area_manager: this.createMemberGroup("AREA_MANAGER"),
                supervisor: this.createMemberGroup("SUPERVISOR"),
                specialist: this.createMemberGroup("SPECIALIST"),
                technician: this.createMemberGroup("TECHNICIAN"),
                operator: this.createMemberGroup("OPERATOR")
            })
        });
        
        this._solutionService.solution$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data: SolutionDetails) => {
                this.solution = data;
        
                data.members.forEach((detail) => {
                    const role = detail.role.toLowerCase();
        
                    if (this.solutionForm.get(`members.${role}`)) {
                        const roleGroup = this.solutionForm.get(`members.${role}`);
        
                        roleGroup.get('member').setValue(detail.member.id);
                        roleGroup.get('role').setValue(detail.role);
                        roleGroup.get('validation').setValue(detail.validation);

                        this.selectedUsers[role] = detail.member.id;
                    }
                });

                this.toggleEditMode(data.id ? false : true);
                this._changeDetectorRef.markForCheck();
            });
        
        this._solutionService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((project: Project) => {
                this.users = project.members;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private createOrganizeGroup() {
        return this._formBuilder.group({
            id: [''],
            name: [''],
            last_name: ['']
        });
    }

    private createMemberGroup(role : string) {
        return this._formBuilder.group({
            member: [''],
            role: [role],
            validation: ['']
        });
    }

    isUserSelected(role: string, userId: string): boolean {
        for (const otherRole of Object.keys(this.selectedUsers)) {
            if (otherRole !== role && this.selectedUsers[otherRole] === userId) {
                return true;
            }
        }

        return false;
    }
    
    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._solutionComponent.matDrawerSolution.close();
    }
    
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.solutionForm.patchValue(this.solution);
            this.editMode = editMode;
        }

        if (!this.editMode && this.solution.id === '') {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
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

    truncateText(text: string, maxLength: number = 18): string {
        if (text.length > maxLength) {
          return text.substring(0, maxLength) + '...';
        }
        return text;
    }

    calculateCalification(){
        return this.solution.members.filter(i => i.validation === 'ACCEPTED').length;
    }

    saveSolution() {
        const _entity = this.solutionForm.getRawValue();
        if (this.solution.id === '') {
            this._solutionService.createSolution(_entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe((solution : SolutionDetails) => {
                this.solution = solution;
                this.toggleEditMode(false);
                this.solutionForm.reset();
                this._router.navigate(['../', this.solution.id], { relativeTo: this._activatedRoute });
                this.snackBar('Nueva solucion agregada correctamente', 'success');
            }); 
        } else {
            this._solutionService.updateSolution(this.solution.id, _entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe(() => {
                this.toggleEditMode(false);
                this.snackBar('Informacion de la solucion modificada correctamente', 'success');
            })
        }
    }
}