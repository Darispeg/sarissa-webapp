import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { Observable, Subject, throwError } from "rxjs";
import { TasksComponent } from "../task.component";
import { TasksService } from "../tasks.service";
import { catchError, takeUntil } from "rxjs/operators";
import { TaskDetails } from "../tasks.types";
import { MyErrorStatusMatcher } from "app/shared/error-status-matcher";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { User } from "app/modules/admin/users/user.types";
import { Project, TaskInfo, UserMember } from "app/modules/project/projects.types";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { TemplatePortal } from "@angular/cdk/portal";
import moment from "moment";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector       : 'project-details',
    templateUrl    : './details-task.component.html',
    styleUrls      : ['./details-task.component.css'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailsComponent implements OnInit, OnDestroy
{
    taskForm: FormGroup;
    
    editMode: boolean = false;
    matcher = new MyErrorStatusMatcher();
    task : TaskDetails;
    incidence : String = 'task'
    tasks$ : Observable<TaskInfo[]>;
    tasks: TaskInfo[];

    /* Users Panel */    
    @ViewChild('usersPanel') private _usersPanel: TemplateRef<any>;
    @ViewChild('usersPanelOrigin') private _usersPanelOrigin: ElementRef;
    private _usersPanelOverlayRef: OverlayRef;
    /* User Panel */    
    filteredUsers: UserMember[];
    checkedUsers: string[] = [];
    users: UserMember[];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    constructor(
        private _tasksComponent : TasksComponent,
        private _taskService : TasksService,
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
        this._tasksComponent.matDrawerTask.open();
        
        this.taskForm = this._formBuilder.group({
            id         : [''],
            title      : ['', Validators.required],
            description: ['', Validators.required],
            parent : [''], 
            start_date : ['', Validators.required], 
            task_completion : this._formBuilder.group({
                target_completion : ['', Validators.required],
                actual_completion : ['']
            }),
            assigned_users : this._formBuilder.array([], Validators.required),
            status : [''],
            progress : ['0'],
            root_cause : [''],
            source_action : [''],
            incidence : ['book']
        });

        this._taskService.task$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((task : TaskDetails) => {
                this.task = task;

                if(task.parent != null)
                    this.incidence = 'subtask';

                (this.taskForm.get("assigned_users") as FormArray).clear();

                const detailsFormGroups = [];

                if(task.assigned_users != undefined){
                    task.assigned_users.forEach((detail) => {
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
                    (this.taskForm.get("assigned_users") as FormArray).push(detailsFormGroup);
                })

                this.toggleEditMode(task.id ? false : true);
                this._changeDetectorRef.markForCheck();
            });
        
        this.tasks$ = this._taskService.tasks$;

        this.tasks$.pipe(takeUntil(this._unsubscribeAll))
            .subscribe((tasks) => {
                this.tasks = tasks;
            });
        
        this._taskService.project$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((project : Project) => {
                this.users = project.members;
                this.filteredUsers = project.members;
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult>{
        return this._tasksComponent.matDrawerTask.close();
    }
    
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.taskForm.patchValue(this.task);
            this.editMode = editMode;
        }

        if (!this.editMode && this.task.id === '') {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    changeDateTaskCompletion(property: string, $event) : void
    {
        this.taskForm.get('task_completion').get(property).setValue(moment($event.target.value['_d']).format('YYYY-MM-DD'));
    }

    changeDate(property: string, $event) : void
    {
        this.taskForm.get('start_date').get(property).setValue(moment($event.target.value['_d']).format('YYYY-MM-DD'));
    }

    changeIncidence(incidence) {
        this.incidence = incidence;
    }

    findTaskParent(key : string) : String {
        return this.tasks.filter(t => t.id === key)[0].title;
    }

    findIncidence(key : string) {
        this._router.navigate(['../' + key], { relativeTo: this._activatedRoute });
    }

    setStatus(status : string): void {
        this.taskForm.get('status').setValue(status);
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

    toggleTaskUsers(user: UserMember, change: MatCheckboxChange): void {
        if (change.checked)
            this.addUserToTask(user);
        else
            this.removeUserFromTask(user.id);
    }

    addUserToTask(user: UserMember) {        
        this.checkedUsers.push(user.id);

        const detailFormGroup = this._formBuilder.group({
            id: [user.id],
            name: [user.name],
            last_name: [user.last_name]
        });

        (this.taskForm.get('assigned_users') as FormArray).push(detailFormGroup);

        this._changeDetectorRef.markForCheck();
    }

    removeUserFromTask(id: String): void
    {
        this.checkedUsers.splice(this.checkedUsers.findIndex(i => i === id), 1);

        const index = this.taskForm.getRawValue()['assigned_users'].findIndex(i => i.id === id);

        const detailsFormArray = this.taskForm.get('assigned_users') as FormArray;

        detailsFormArray.removeAt(index);

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

    saveTask() {
        const _entity = this.taskForm.getRawValue();
        if (this.task.id === '') {
            this._taskService.createTask(_entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe((task : TaskDetails) => {
                this.task = task;
                this.toggleEditMode(false);
                this.taskForm.reset();
                this._router.navigate(['../', this.task.id], { relativeTo: this._activatedRoute });
                this._taskService.getTasksByProjectId(localStorage.getItem('idProject')).subscribe();
                this.snackBar('Nueva tarea agregada correctamente', 'success');
            }); 
        } else {
            this._taskService.updateTask(this.task.id, _entity)
            .pipe(
                catchError((error) => {
                    this.snackBar(error, 'error')
                    return throwError(error);
                })
            )
            .subscribe(() => {
                this.toggleEditMode(false);
                this._taskService.getTasksByProjectId(localStorage.getItem('idProject')).subscribe();
                this.snackBar('Informacion de la tarea modificada correctamente', 'success');
            })
        }
    }
}