import { CommonModule, NgFor, NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Optional, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UbicationService } from '@modules/catalogs/services/ubication.service';
import { MaterialModule } from 'src/app/material.module';
import { Observable, filter, map, startWith, switchMap } from 'rxjs'
import { CustomersService } from '@modules/catalogs/services/customer.service';
import { TruckService } from '@modules/catalogs/services/truck.service';
import { DriverService } from '@modules/catalogs/services/driver.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { InspectionService } from '../services/inspection.service';

interface Inspection{

}

enum EquipmentType {
    BOTANDO = "BOTANDO",
    CARGADO = "CARGADO",
    VACIO = "VACIO"
}

interface Driver {
    id?: number;
    employeeCode?: string;
    firstName?: string;
    lastName?: string;
    license?: string;
    phoneNumber?: string;
    description?: string;
    urlPhoto?: string;
    customer?: any
}

interface Truck {
    id?: number;
    plates1?: string;
    plates2?: string;
    code?: string;
    name?: string;
    description?: string;
    brand?: string;
    type?: string;
    vin?: string;
    customer?: any
}

interface Ubication {
    id: number;
    name: string;
}

@Component({
    selector: 'select-ubication',
    templateUrl: 'select-ubication.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor],
})
export class AppSelectUbicationComponent {

    ubicationSelected = new FormControl('');
    ubications: Ubication[] = [];
    private ubicationService: UbicationService = inject(UbicationService);
    onSave = new EventEmitter<any>();
    constructor(
        private customerService: CustomersService,
        public dialogRef: MatDialogRef<AppSelectUbicationComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.getUbications();
        if (data != null) {

        }
    }

    onSubmit() {
        if (this.ubicationSelected.invalid) {
            return;
        }

        const findUbication = this.ubications.find(x => x.id.toString() == this.ubicationSelected.value);

        if (findUbication) {
            localStorage.setItem('ubicationSelected', JSON.stringify(findUbication));
            this.dialogRef.close();
            this.onSave.emit({
                result: 'OK'
            })
        }
    }

    getUbications() {
        this.ubicationService
            .getLocationsActive()
            .subscribe((res: Ubication[]) => {
                this.ubications = res;
            })
    }

}

@Component({
    selector: 'app-inspections-k9',
    templateUrl: './inspections-k9.component.html',
    standalone: true,
    imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, TablerIconsModule, MatIconModule, NgForOf, NgIf],
})
export class AppInspectonsK9Component implements OnInit {

    driverData: Driver | null;
    truckData: Truck | null;
    equipmentType: EquipmentType;
    ubicationSelected: Ubication;
    drivers: Driver[] = [];
    trucks: Truck[] = [];
    customers: Ubication[] = [];
    ubications: Ubication[] = [];
    options: string[] = ['One', 'Two', 'Three'];
    filteredOptions: Observable<Ubication[]>;

    private driverService: DriverService = inject(DriverService);
    private trucksService: TruckService = inject(TruckService);
    private customersService: CustomersService = inject(CustomersService);
    private ubicationService: UbicationService = inject(UbicationService);

    constructor(
        private inspectionService:InspectionService,
        public dialog: MatDialog
    ) {

        this.readUbicationSelected();
    }

    ngOnInit(): void {
   
        this.f.truckId.valueChanges.subscribe((value: any) => {
            if (value > 0) {
                const truck = this.trucks.find(x => x.id == value);
                truck && (this.truckData = truck)
            } else {
                this.truckData = null;
            }
        });

        this.f.driverId.valueChanges.subscribe((value: any) => {
            if (value > 0) {
                const driver = this.drivers.find(x => x.id == value);
                driver && (this.driverData = driver)
            } else {
                this.driverData = null
            }
        });

        this.getCustomers();
    }

    onChangeEquipment(event: MatRadioChange) {

        if (this.f.equipmentType.value == EquipmentType.BOTANDO) {
            this.f.equipmentCode.clearValidators();
            this.f.equipmentCode.setValue('');

            this.f.equipmentPlates.clearValidators();
            this.f.equipmentPlates.setValue('');

            this.f.fromEquipment.clearValidators();
            this.f.fromEquipment.setValue('');

        } else {
            this.f.equipmentCode.addValidators(Validators.required);
            this.f.equipmentPlates.addValidators(Validators.required);
            this.f.fromEquipment.addValidators(Validators.required);
            
        }
        this.form.updateValueAndValidity({
            onlySelf: true
        });
    }

    readUbicationSelected() {
        const ubicationSelected = localStorage.getItem('ubicationSelected');
        if (!ubicationSelected) {
            this.openDialog('', '', null);
            return;
        } else {
            const us: Ubication = JSON.parse(localStorage.getItem('ubicationSelected') || '');

            this.ubicationSelected = us;

        }
    }

    openDialog(
        enterAnimationDuration: string,
        exitAnimationDuration: string,
        data: any = null
    ) {
        let dialogSave = this.dialog.open(AppSelectUbicationComponent, {
            width: 'auto',
            enterAnimationDuration,
            exitAnimationDuration,
            disableClose: true,
            data,
            height: 'auto'
        });

        dialogSave.componentInstance.onSave.subscribe((d: any) => {
            this.readUbicationSelected();
        });
        dialogSave.afterClosed().subscribe((data) => {
            dialogSave.componentInstance.onSave.unsubscribe();
        });

    }

    form = new FormGroup({
        id: new FormControl(0),
        customerId: new FormControl('', [Validators.required]),
        driverId: new FormControl('', [Validators.required]),
        truckId: new FormControl('', [Validators.required]),
        equipmentType: new FormControl('BOTANDO', [Validators.required]),
        equipmentCode: new FormControl(''),
        equipmentPlates: new FormControl(''),
        fromEquipment: new FormControl(''),
    });

    get f() {
        return this.form.controls;
    }

    getTrucks() {
        const { customerId } = this.f;
        if (customerId.value != "") {
            this.trucksService
                .getTrucksByCustomerId({ customerId: customerId.value })
                .subscribe((res: any) => {
                    this.trucks = res;
                });

            this.driverService
                .getDriversByCustomerId({ customerId: customerId.value })
                .subscribe((res: any) => {
                    this.drivers = res;
                });

        } else {
            this.trucks = [];
        }
    }

    onSubmit() {
        
        if(this.form.invalid){
            alert('NOT VALID')
            return;
        }

        this.inspectionService
            .setInspection(this.form.getRawValue())
            .subscribe((res:any)=> {
                alert('TODO BIEN OK')
            })
    }

    private _filter(value: string): Ubication[] {
        const filterValue = value.toLowerCase();
        return this.ubications.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    getCustomers() {
        this.customersService
            .getCustomersActive()
            .subscribe((res: Ubication[]) => {
                this.customers = res;
            })
    }

    getUbications() {
        this.ubicationService
            .getLocationsActive()
            .subscribe((res: Ubication[]) => {
                this.ubications = res;
            })
    }

}
