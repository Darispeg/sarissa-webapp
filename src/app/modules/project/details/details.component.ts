import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectsService } from "../projects.service";
import { catchError, takeUntil } from "rxjs/operators";
import { Observable, Subject, throwError } from "rxjs";
import { Project } from "../projects.types";
import { ProjectsListComponent } from "../list/list.component";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import moment from "moment";
import { User } from "app/modules/admin/users/user.types";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { UsersService } from "app/modules/admin/users/users.service";

@Component({
    selector       : 'project-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsDetailsComponent implements OnInit
{
    projectForm: FormGroup;
    project : Project;

    editMode: boolean = false;
    matcher = new MyErrorStatusMatcher();

    /* Users Panel */    
    @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
    @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
    private _usersPanelOverlayRef: OverlayRef;
    /* User Panel */    
    filteredUsers: User[];
    checkedUsers: string[] = [];
    users: User[];
    users$ : Observable<User[]>;

    icons : string[] = ['public', 'bug_report', 'build', 'store', 'shopping_cart', 'settings', 'work', 'flag', 'insert_invitation', 'report', 'attach_money', 'security', 'star_border']

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _projectService: ProjectsService,
        private _userService: UsersService,
        private _projectListComponent : ProjectsListComponent,
        private _router: Router, 
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar,
        private _overlay: Overlay,
        private _renderer2: Renderer2,
        private _viewContainerRef: ViewContainerRef,
    ) {}

    ngOnInit(): void {
        this._projectListComponent.matDrawer.open();

        this.projectForm = this._formBuilder.group({
            id         : [''],
            icon       : ['', Validators.required],
            title      : ['', Validators.required],
            description: ['', Validators.required],
            organizer : ['', Validators.required], 
            project_completion : this._formBuilder.group({
                target_completion : ['', Validators.required],
                actual_completion : ['']
            }),
            members : this._formBuilder.array([], Validators.required),
            status : ['']
        });

        this._projectService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((project: Project) => {
                this.project = project;
                (this.projectForm.get("members") as FormArray).clear();

                const detailsFormGroups = [];

                if(project.members != undefined){
                    project.members.forEach((detail) => {
                        detailsFormGroups.push(
                            this._formBuilder.group({
                                id: [detail.id],
                                name: [detail.name],
                                last_name: [detail.last_name]
                            })
                        )
                        this.checkedUsers.push(detail.id);
                    });
                }

                detailsFormGroups.forEach((detailsFormGroup) => {
                    (this.projectForm.get("members") as FormArray).push(detailsFormGroup);
                })

                this.toggleEditMode(project.id ? false : true);
                this._changeDetectorRef.markForCheck();
            });

        this.users$ = this._userService.users$;
        
        this._userService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users : User[]) => {
                this.users = users;
                this.filteredUsers = users;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._projectListComponent.matDrawer.close();
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.projectForm.patchValue(this.project);
            
            if (this.project != null)
                this.projectForm.get('organizer').setValue(this.project.organizer.id);

            this.editMode = editMode;
        }

        if (!this.editMode && !this.project.id) {
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

    changeDate(property: string, $event) : void
    {
        this.projectForm.get('project_completion').get(property).setValue(moment($event.target.value['_d']).format('YYYY-MM-DD'));
    }

    /* Users */
    openUsersPanel(): void {
        this._usersPanelOverlayRef = this._overlay.create({
            backdropClass: '',
            hasBackdrop: true,
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._usersPanelOrigin.nativeElement)
                .withFlexibleDimensions(true)
                .withViewportMargin(64)
                .withLockedPosition(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    }
                ])
        });

        this._usersPanelOverlayRef.attachments().subscribe(() => {
            this._renderer2.addClass(this._usersPanelOrigin.nativeElement, 'panel-opened');
            this._usersPanelOverlayRef.overlayElement.querySelector('input').focus();
        });

        const templatePortal = new TemplatePortal(this._usersPanel, this._viewContainerRef);
        this._usersPanelOverlayRef.attach(templatePortal);
        this._usersPanelOverlayRef.backdropClick().subscribe(() => {

            this._renderer2.removeClass(this._usersPanelOrigin.nativeElement, 'panel-opened');

            if (this._usersPanelOverlayRef && this._usersPanelOverlayRef.hasAttached()) {
                this._usersPanelOverlayRef.detach();
            }

            if (templatePortal && templatePortal.isAttached)
                templatePortal.detach();
        });
    }

    filterUsers(event): void {
        const value = event.target.value.toLowerCase();
        this.filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(value));
    }

    filterUsersInput(event): void {
        if (event.key != 'Enter') {
            return;
        }
    }

    toggleProjectUsers(user: User, change: MatCheckboxChange): void {
        if (change.checked)
            this.addUserToProject(user);
        else
            this.removeUserFromProject(user.id);
    }

    addUserToProject(user: User) {        
        this.checkedUsers.push(user.id);

        const detailFormGroup = this._formBuilder.group({
            id: [user.id],
            name: [user.name],
            last_name: [user.last_name]
        });

        (this.projectForm.get('members') as FormArray).push(detailFormGroup);

        this._changeDetectorRef.markForCheck();
    }

    removeUserFromProject(id: String): void
    {
        this.checkedUsers.splice(this.checkedUsers.findIndex(i => i === id), 1);

        const index = this.projectForm.getRawValue()['members'].findIndex(i => i.id === id);

        const detailsFormArray = this.projectForm.get('members') as FormArray;

        detailsFormArray.removeAt(index);

        this._changeDetectorRef.markForCheck();
    }

    setStatus(status : string): void {
        this.projectForm.get('status').setValue(status);
    }

    saveProject()
    {
        const _entity = this.projectForm.getRawValue();
        if (this.project.id === '') {
            this._projectService.createProject(_entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe((project : Project) => {
                this.project = project;
                this.toggleEditMode(false);
                this.projectForm.reset();
                this._router.navigate(['../', this.project.id], { relativeTo: this._activatedRoute });
                this.snackBar('Nueva proyecto agregado correctamente', 'success');
            }); 
        } else {
            this._projectService.updateProject(this.project.id, _entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe(() => {
                this.toggleEditMode(false);
                this.snackBar('Informacion del proyecto modificada correctamente', 'success');
            })
        }
    }
}