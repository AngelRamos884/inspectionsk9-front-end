import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CatalogsRoutes } from './catalogs.routing';

@NgModule({
  imports: [
    RouterModule.forChild(CatalogsRoutes),
  ],
})
export class CatalogsModule {}
