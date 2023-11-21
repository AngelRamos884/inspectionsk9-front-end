import { EventEmitter, Optional, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
import { DriverService } from '../services/driver.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { CustomersService } from '../services/customer.service';
import { FileService } from '../services/file.service';

@Component({
    selector: 'save-driver',
    templateUrl: 'save-driver.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveDriverComponent {

    urlPhoto: any = null;
    file: File;
    photoDriver: any = null;
    customers$: Observable<any[]>;
    onSave = new EventEmitter<any>();
    constructor(
        private customerService: CustomersService,
        public dialogRef: MatDialogRef<AppSaveDriverComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getCustomersAvailable();
        if (data != null) {
            const { customer, urlPhoto, ...d } = data;

            if (urlPhoto != "") {
                const token = localStorage.getItem('token');
                this.urlPhoto = `http://localhost:8000/uploads/${urlPhoto}?token=${token}`
            }

            this.form.patchValue({ ...d, customerId: customer.id });
        }
    }

    onFileSelected(event: any) {
        const files = event.target.files;
        if (files.length === 0)
            return;

        const mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            // this.message = "Only images are supported.";
            alert("Only images are supported.")
            return;
        }

        const reader = new FileReader();
        this.file = files;
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
            // debugger
            this.urlPhoto = reader.result;
            // console.log( reader.result)
        }
    }

    getCustomersAvailable() {

        this.customers$ = this.customerService.getAllCustomers();

    }

    form = new FormGroup({
        id: new FormControl(0),
        customerId: new FormControl('', [Validators.required]),
        employeeCode: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        license: new FormControl('', [Validators.required]),
        phoneNumber: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        isActive: new FormControl(false)
    });

    get f() {
        return this.form.controls;
    }

    submit() {

        if (this.form.valid) {
            this.onSave.emit({
                status: 'OK',
                data: { ...this.form.getRawValue(), file: this.file },
            });
            this.dialogRef.close();
        }
    }
}

@Component({
    selector: 'app-drivers',
    templateUrl: './drivers.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class DriversComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
        Object.create(null);

    displayedColumns: string[] = ['company', 'names', 'employeeCode', 'isActive', 'action'];
    dataSource = new MatTableDataSource();

    constructor(
        private fileService: FileService,
        public dialog: MatDialog,
        private driverService: DriverService
    ) { }

    ngOnInit(): void {
        this.getAllDrivers();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data: any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveDriverComponent, {
            width: '500vh',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data,
            height: '80vh'
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {

            const { status, data } = d;

            if (status == "OK") {
                this.driverService
                    .save(data)
                    .subscribe((res: any) => {
                        const { id, customerId } = res;

                        debugger
                        //TODO -> Upload File
                        if (!data?.file) {
                            this.getAllDrivers();
                            return;
                        }
                        this.fileService
                            .uploadFile({ file: data?.file[0], driverId: id, customerId })
                            .subscribe((res: any) => {
                                this.getAllDrivers();
                            });

                    });
            }

        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    getAllDrivers() {
        this.driverService
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
