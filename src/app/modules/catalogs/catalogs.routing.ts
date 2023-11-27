import { Routes } from '@angular/router';
import { UbicationsComponent } from './ubications/ubications.component';
import { CustomersComponent } from './customers/customers.component';
import { DriversComponent } from './drivers/drivers.component';
import { TrucksComponent } from './trucks/trucks.component';
import { QuestionsComponent } from './questions/questions.component';


export const CatalogsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'questions',
        component: QuestionsComponent,
      },
      {
        path: 'trucks',
        component: TrucksComponent,
      },
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
