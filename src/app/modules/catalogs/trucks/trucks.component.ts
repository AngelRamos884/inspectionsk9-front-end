import { EventEmitter, Optional, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
import { TruckService } from '../services/truck.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { CustomersService } from '../services/customer.service';
import { FileService } from '../services/file.service';

@Component({
    selector: 'save-truck',
    templateUrl: 'save-truck.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveTruckComponent {

    customers$: Observable<any[]>;
    onSave = new EventEmitter<any>();
    constructor(
        private customerService: CustomersService,
        public dialogRef: MatDialogRef<AppSaveTruckComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getCustomersAvailable();
        if (data != null) {
            const { customer, ...d } = data;

            this.form.patchValue({ ...d, customerId: customer.id });
        }
    }

    getCustomersAvailable() {

        this.customers$ = this.customerService.getAllCustomers();

    }

    form = new FormGroup({
        id: new FormControl(0),
        customerId: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        plates1: new FormControl('', [Validators.required]),
        brand: new FormControl('', [Validators.required]),
        type: new FormControl('', [Validators.required]),
        vin: new FormControl('', [Validators.required]),
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
                data: { ...this.form.getRawValue() },
            });
            this.dialogRef.close();
        }
    }
}

@Component({
    selector: 'app-trucks',
    templateUrl: './trucks.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class TrucksComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
        Object.create(null);

    displayedColumns: string[] = ['company', 'code', 'plates1', 'brand', 'type','isActive', 'action'];

    dataSource = new MatTableDataSource();

    constructor(
        private fileService: FileService,
        public dialog: MatDialog,
        private truckService: TruckService
    ) { }

    ngOnInit(): void {
        this.getAllTrucks();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data: any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveTruckComponent, {
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
                this.truckService
                    .save(data)
                    .subscribe((res: any) => {
                        this.getAllTrucks();
                    });
            }

        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    getAllTrucks() {
        this.truckService
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
