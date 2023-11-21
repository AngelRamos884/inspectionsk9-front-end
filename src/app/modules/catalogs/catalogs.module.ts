import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogsRoutes } from './catalogs.routing';
import { UbicationsComponent } from './ubications/ubications.component';
import { CustomersComponent } from './customers/customers.component';

@NgModule({
  imports: [
    RouterModule.forChild(CatalogsRoutes),
    UbicationsComponent,
    CustomersComponent
  ],
})
export class CatalogsModule {}
