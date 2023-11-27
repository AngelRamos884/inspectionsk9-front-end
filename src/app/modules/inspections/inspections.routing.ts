import { Routes } from '@angular/router';
import { AppInspectonsK9Component } from './inspections-k9/inspections-k9.component';

export const InspectionsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inspections',
        component: AppInspectonsK9Component,
      },
    ],
  },
];
