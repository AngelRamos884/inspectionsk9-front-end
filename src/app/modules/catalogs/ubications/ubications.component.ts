import { EventEmitter, Optional, Inject,ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
import { UbicationService } from '../services/ubication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    selector: 'save-ubication',
    templateUrl: 'save-ubication.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveUbicationComponent {
    
    onSave = new EventEmitter<any>();

    constructor(
        public dialogRef: MatDialogRef<AppSaveUbicationComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.form.patchValue(data);
    }

    form = new FormGroup({
        id: new FormControl(0),
        isActive: new FormControl(false),
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
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
    selector: 'app-ubications',
    templateUrl: './ubications.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class UbicationsComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);

    displayedColumns: string[] = ['name', 'code', 'description', 'isActive', 'action'];
    dataSource = new MatTableDataSource();

    constructor(
        public dialog: MatDialog,
        private ubicationService: UbicationService
    ) { }

    ngOnInit(): void {
        this.getAllUbications();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data:any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveUbicationComponent, {
            width: 'auto',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {
            
            const { status, data} = d;

            if(status == "OK"){
                this.ubicationService
                    .saveUbication(data)
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
        this.ubicationService
            .getAllUbications()
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
