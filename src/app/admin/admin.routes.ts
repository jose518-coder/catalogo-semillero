import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { cambiosSinGuardarGuard } from '../guards/cambios-sin-guardar.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
      {
        path: 'productos',
        loadComponent: () =>
          import(
            './admin-productos/admin-productos.component'
          ).then(
            m => m.AdminProductosComponent
          ),
        canDeactivate: [
          cambiosSinGuardarGuard
        ],
        title: 'Administración de productos'
      }
    ]
  }
];