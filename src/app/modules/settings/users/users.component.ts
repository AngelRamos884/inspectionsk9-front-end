import { EventEmitter, Optional, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
// import { TruckService } from '../services/user.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { CustomersService } from '@modules/catalogs/services/customer.service';
import { ERoleType } from 'src/app/enums/role-type.interface';
import Swal from 'sweetalert2';
// import { CustomersService } from '../services/customer.service';
// import { FileService } from '../services/file.service';

@Component({
    selector: 'save-user',
    templateUrl: 'save-user.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveUserComponent {

    hide = true;
    customers$: Observable<any[]>;
    roles$: Observable<any[]>;
    onSave = new EventEmitter<any>();
    constructor(
        private userService:UserService,
        private customerService: CustomersService,
        public dialogRef: MatDialogRef<AppSaveUserComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.roles$ = this.userService.getRolesActive();
        this.getCustomersAvailable();
        if (data != null) {
            const { roles, customer, ...d } = data;
            this.form.controls['password'].clearValidators();
            this.form.patchValue({ ...d, roleId:roles[0].id, customerId:customer?.id });
            this.onChangeCustomerValidation();
        }
    }

    onChangeCustomerValidation(){
        if(Number(this.f.roleId.value) == ERoleType.CUSTOMER){
            this.form.controls['customerId'].addValidators(Validators.required);               
        }else{
            this.form.controls['customerId'].clearValidators();
        }
    }

    getCustomersAvailable() {

        this.customers$ = this.customerService.getAllCustomers();

    }

    form = new FormGroup({
        id: new FormControl(0),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        roleId: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required]),
        customerId: new FormControl(''),
        isActive: new FormControl(false)
    });

    get f() {
        return this.form.controls;
    }

    submit() {
        let customer: any = null;
        if (this.form.valid) {
            if (Number(this.f.roleId.value) != ERoleType.GENERAL) {
                customer = { id: this.f.customerId.value };
            };
            this.onSave.emit({
                status: 'OK',
                data: { ...this.form.getRawValue(), roles: [{ id: this.f.roleId.value }], customer }
            });
            this.dialogRef.close();
        }
    }
}

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class UsersComponent implements OnInit {

    users$:Observable<any>;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
        Object.create(null);

    displayedColumns: string[] = ['email', 'names', 'roles', 'isActive', 'action'];

    dataSource = new MatTableDataSource();

    constructor(
        private userService:UserService,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getAllUsers();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data: any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveUserComponent, {
            width: '500vh',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data,
            height: '50vh'
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {
            debugger
            const { status, data } = d;
            if (status == "OK") {
                this.userService
                    .save(data)
                    .subscribe((res: any) => {
                        this.getAllUsers();
                    });
            }

        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    getAllUsers() {
        this.userService
            .getAll()
            .subscribe((res: any) => {
                this.dataSource = new MatTableDataSource(res);
                this.dataSource.paginator = this.paginator;
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
