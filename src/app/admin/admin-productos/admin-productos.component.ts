import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { catchError, startWith, switchMap, tap } from 'rxjs/operators';

import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { TablaProductosComponent } from '../../tabla-productos/tabla-productos.component';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, RouterLink, TablaProductosComponent],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css'
})
export class AdminProductosComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private recargar$ = new Subject<void>();

  productos$: Observable<Producto[]> = this.recargar$.pipe(
    startWith(undefined),
    switchMap(() => this.productoService.obtenerTodos())
  );

  private eliminarProducto$ = new Subject<number>();

  eliminacion$: Observable<string> = this.eliminarProducto$.pipe(
    switchMap(id =>
      this.productoService.eliminar(id).pipe(
        tap(() => {
          this.recargar$.next();
        }),
        switchMap(() => of('Producto eliminado correctamente.')),
        catchError(error => {
          console.error('Error al eliminar producto', error);
          return of('No se pudo eliminar el producto.');
        })
      )
    )
  );

  editar(producto: Producto): void {
    this.router.navigate([
      '/admin/productos',
      producto.id,
      'editar'
    ]);
  }

  eliminar(producto: Producto): void {
    this.eliminarProducto$.next(producto.id);
  }
}