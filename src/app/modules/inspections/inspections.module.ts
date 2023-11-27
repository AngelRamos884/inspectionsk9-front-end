import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InspectionsRoutes } from './inspections.routing';

@NgModule({
  imports: [
    RouterModule.forChild(InspectionsRoutes),
  ],
})
export class InspectionsModule {}
