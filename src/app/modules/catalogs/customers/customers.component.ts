import { EventEmitter, Optional, Inject,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ScrollStrategy, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { CustomersService } from '../services/customer.service';

@Component({
    selector: 'save-customer',
    templateUrl: './save-customer.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveCustomerComponent {
    
    onSave = new EventEmitter<any>();

    constructor(
        public dialogRef: MatDialogRef<AppSaveCustomerComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form.patchValue(data);
    }

    form = new FormGroup({
        id: new FormControl(0),
        name: new FormControl('', [Validators.required]),
        razonSocial: new FormControl('', [Validators.required]),
        rfc: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        contacts: new FormControl('', [Validators.required]),
        phoneNumbers: new FormControl('', [Validators.required]),
        emails: new FormControl('', [Validators.required]),
        service: new FormControl('', [Validators.required]),
        costPerInspection: new FormControl('', [Validators.required]),
        isActive: new FormControl(false),
    });

    get f() {
        return this.form.controls;
    }

    submit() {

        if(this.form.valid){
            this.onSave.emit({
                status:'OK',
                data:this.form.getRawValue()
            });
            this.dialogRef.close();
        }
    }
}

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class CustomersComponent implements OnInit {

    scrollStrategy: ScrollStrategy;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

    displayedColumns: string[] = ['name', 'rfc', 'address', 'isActive', 'action'];
    dataSource = new MatTableDataSource();

    constructor(
        private readonly sso: ScrollStrategyOptions,
        public dialog: MatDialog,
        private customersService: CustomersService
    ){
        this.scrollStrategy = this.sso.close();
    }

    ngOnInit(): void {
        this.getAllUbications();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data:any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveCustomerComponent, {
            width: 'auto',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            scrollStrategy:this.scrollStrategy,
            data,
            height:'90vh'
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {
            
            const { status, data} = d;

            if(status == "OK"){
                this.customersService
                    .saveCustomer(data)
                    .subscribe((res:any) => {
                        this.getAllUbications();
                    });
            }
            
        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    getAllUbications() {
        this.customersService
            .getAllCustomers()
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
