import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard, LoginGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    canActivate:[AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },
      {
        path: 'inspection',
        loadChildren: () =>
          import('./modules/inspections/inspections.module').then(
            (m) => m.InspectionsModule
          ),
      }, 
      {
        path: 'settings',
        loadChildren: () =>
          import('./modules/settings/settings.module').then(
            (m) => m.SettingsModule
          ),
      }, 
      {
        path: 'catalogs',
        loadChildren: () =>
          import('./modules/catalogs/catalogs.module').then(
            (m) => m.CatalogsModule
          ),
      }, 
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./modules/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'authentication',
        loadChildren: () =>
          import('./modules/auth/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
