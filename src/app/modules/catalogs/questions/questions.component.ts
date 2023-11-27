import { EventEmitter, Optional, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../../app/material.module';
import { QuestionService } from '../services/question.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { CustomersService } from '../services/customer.service';
import { FileService } from '../services/file.service';

@Component({
    selector: 'save-question',
    templateUrl: 'save-question.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class AppSaveQuestionComponent {

    data$: Observable<any[]>;
    onSave = new EventEmitter<any>();
    constructor(
        private customerService: CustomersService,
        public dialogRef: MatDialogRef<AppSaveQuestionComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getCustomersAvailable();
        if (data != null) {
            const { ...d } = data;

            this.form.patchValue({ ...d });
        }
    }

    getCustomersAvailable() {

        this.data$ = this.customerService.getAllCustomers();

    }

    form = new FormGroup({
        id: new FormControl(0),
        question: new FormControl('', [Validators.required]),
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
    selector: 'app-questions',
    templateUrl: './questions.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule],
})
export class QuestionsComponent implements OnInit {

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
        Object.create(null);

    displayedColumns: string[] = ['id', 'question', 'isActive', 'action'];
    dataSource = new MatTableDataSource();

    constructor(
        private fileService: FileService,
        public dialog: MatDialog,
        private questionService: QuestionService
    ) { }

    ngOnInit(): void {
        this.getAllQuestions();
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data: any = null
    ) {
        let dialogSave = this.dialog.open(AppSaveQuestionComponent, {
            width: 'auto',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data,
            height: 'auto'
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {

            const { status, data } = d;

            if (status == "OK") {
                debugger
                this.questionService
                    .save(data)
                    .subscribe((res: any) => {
                        this.getAllQuestions();
                    });
            }

        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    getAllQuestions() {
        this.questionService
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
