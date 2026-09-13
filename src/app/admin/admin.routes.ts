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
        path: 'productos/nuevo',
        loadComponent: () =>
          import('./formulario-producto/formulario-producto.component')
            .then(m => m.FormularioProductoComponent),
        canDeactivate: [cambiosSinGuardarGuard],
        title: 'Crear producto'
      },

      {
        path: 'productos/:id/editar',
        loadComponent: () =>
          import('./formulario-producto/formulario-producto.component')
            .then(m => m.FormularioProductoComponent),
        canDeactivate: [cambiosSinGuardarGuard],
        title: 'Editar producto'
      },

      {
        path: 'productos',
        loadComponent: () =>
          import('./admin-productos/admin-productos.component')
            .then(m => m.AdminProductosComponent),
        title: 'Administración de productos'
      }

    ]
  }
];
