import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layouts/blank/blank.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    // canActivate:[AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboards/dashboard1',
        pathMatch: 'full',
      },
      {
        path: 'dashboards',
        loadChildren: () =>
          import('./modules/dashboards/dashboards.module').then(
            (m) => m.DashboardsModule
          ),
      },
      //TODO: Catalogs module
      {
        path: 'catalogs',
        loadChildren: () =>
          import('./modules/catalogs/catalogs.module').then(
            (m) => m.CatalogsModule
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
