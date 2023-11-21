import { Routes } from '@angular/router';
import { UbicationsComponent } from './ubications/ubications.component';
import { CustomersComponent } from './customers/customers.component';
import { DriversComponent } from './drivers/drivers.component';


export const CatalogsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'drivers',
        component: DriversComponent,
      }, 
      {
        path: 'ubications',
        component: UbicationsComponent,
      }, 
      {
        path: 'customers',
        component: CustomersComponent,
      }
    ],
  },
];
