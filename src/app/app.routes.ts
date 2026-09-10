import { Routes } from '@angular/router';
import { CatalogoPageComponent } from './catalogo-page/catalogo-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { NoEncontradoComponent } from './no-encontrado/no-encontrado.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'productos',
    pathMatch: 'full'
  },

  {
    path: 'productos',
    component: CatalogoPageComponent,
    title: 'Catálogo'
  },

  {
    path: 'productos/:id',
    loadComponent: () =>
      import('./detalle-producto/detalle-producto.component')
        .then(m => m.DetalleProductoComponent),
    title: 'Detalle del producto'
  },

  {
    path: 'carrito',
    loadComponent: () =>
      import('./carrito-page/carrito-page.component')
        .then(m => m.CarritoPageComponent),
    canActivate: [authGuard],
    title: 'Mi carrito'
  },

  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Iniciar sesión'
  },

  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes')
        .then(m => m.ADMIN_ROUTES)
  },

  {
    path: '**',
    component: NoEncontradoComponent,
    title: 'Página no encontrada'
  }
];