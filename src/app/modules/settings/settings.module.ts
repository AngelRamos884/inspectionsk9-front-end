import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsRoutes } from './settings.routing';

@NgModule({
  imports: [
    RouterModule.forChild(SettingsRoutes),
  ],
})
export class SettingsModule {}
