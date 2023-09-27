import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, throwError } from "rxjs";
import { UsersListComponent } from '../list/list.component';
import { MatDrawerToggleResult } from "@angular/material/sidenav";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from "../users.service";
import { catchError, takeUntil } from "rxjs/operators";
import { User } from "../user.types";
import moment from "moment";

@Component({
    selector: 'areas-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersDetailsComponent implements OnInit, OnDestroy 
{
    editMode: boolean = false;
    users: User[];
    user: User;

    userForm: FormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _usersListComponent: UsersListComponent,
        private _formBuilder: FormBuilder,
        private _userService: UsersService,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this._usersListComponent.matDrawer.open();

        this.userForm = this._formBuilder.group({
            id: [''],
            name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            last_name: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            birthday: [''],
            ci: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            role: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            phone: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            position: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3)]],
            status: ['ACTIVE']
        });

        this._userService.users$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((users: any[]) => {
                this.users = users;
                this._changeDetectorRef.markForCheck();
            });

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.user = user;
                this.userForm.patchValue(user);
                this.toggleEditMode(user.id ? false : true);

                this._changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._usersListComponent.matDrawer.close();
    }

    changeDate(property: string, $event) : void
    {
        this.userForm.get(property).setValue(moment($event.target.value['_d']).format('YYYY-MM-DD'));
    }

    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        }
        else {
            this.editMode = editMode;
        }

        if (!this.editMode && !this.user.id) {
            this._router.navigate(['../'], { relativeTo: this._activatedRoute });
        }

        this._changeDetectorRef.markForCheck();
    }

    setStatus(status: string): void {
        this.userForm.get('status').setValue(status);
    }

    snackBar(message) {
        this._snackBar.open(message, '', {
            duration: 3000,
            verticalPosition: 'bottom',
            panelClass: ['bg-blue-800', 'font-bold', 'text-gray-100']
        });
    }

    saveUser() {
        const _entity = this.userForm.getRawValue();
        if (this.user.id === '') {
            this._userService.createUser(_entity)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error)
                        return throwError(error);
                    })
                )
                .subscribe((user) => {
                    this.user = user;
                    this.toggleEditMode(false);
                    this.userForm.reset();
                    this._router.navigate(['../', this.user.id], { relativeTo: this._activatedRoute });
                    this.snackBar('Nueva usuario agregado correctamente');
                }); 
        } else {
            this._userService.updateUser(this.user.id, _entity)
                .pipe(
                    catchError((error) => {
                        this.snackBar(error)
                        return throwError(error);
                    })
                )
                .subscribe(() => {
                    this.toggleEditMode(false);
                    this.snackBar('Informacion del usuario modificada correctamente');
                })
        }
    }
}
