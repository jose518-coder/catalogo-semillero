import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { shareReplay } from 'rxjs';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  finalize,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';

import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
import { ActualizarProducto } from '../models/ActualizarProducto';
import { CrearProducto } from '../models/crear-producto';
import { CategoriaService } from '../services/categoria.service';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { TarjetaProductoComponent } from '../tarjeta-producto/tarjeta-producto.component';
import { TablaProductosComponent } from '../tabla-productos/tabla-productos.component';

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [
    CommonModule,
    TarjetaProductoComponent,
    TablaProductosComponent
  ],
  templateUrl: './catalogo-page.component.html',
  styleUrl: './catalogo-page.component.css'
})
export class CatalogoPageComponent {

  productoEditando = signal<Producto | null>(null);
  tituloEdicion = signal('');
  precioEdicion = signal(0);
  stockEdicion = signal(0);

  productoNuevo = signal(false);
  tituloNuevo = signal('');
  precioNuevo = signal(0);
  descripcionNueva = signal('');
  imagenNueva = signal('');
  categoriaNueva = signal<number | null>(null);

  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private carritoService = inject(CarritoService);

  cargando = signal(false);
  errorProductos = this.productoService.error;
  categoriaSeleccionada = signal<number | null>(null);

  private categoriaSeleccionada$ =
    toObservable(this.categoriaSeleccionada);
  private recargar = signal(0);
  private recargar$ = toObservable(this.recargar);

  productos$: Observable<Producto[]> =
    combineLatest([
      this.categoriaSeleccionada$,
      this.recargar$
    ]).pipe(
      switchMap(([categoriaId]) => {
        this.cargando.set(true);
        return this.productoService
          .obtenerTodos(categoriaId ?? undefined)
          .pipe(
            finalize(() => this.cargando.set(false))
          );
      })
    );

  categorias$: Observable<Categoria[]> =
  this.categoriaService
    .obtenerTodas()
    .pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true
      })
    );

  private eliminarProducto$ = new Subject<number>();

  eliminacion$: Observable<string> =
    this.eliminarProducto$.pipe(
      switchMap(id =>
        this.productoService.eliminar(id).pipe(
          tap(() => {
            this.recargar.update(valor => valor + 1);
          }),
          map(() => 'Producto eliminado correctamente.'),
          catchError(error => {
            console.error(
              'Error al eliminar el producto',
              error
            );
            return of(
              'No se pudo eliminar el producto.'
            );
          })
        )
      )
    );

  private crearProducto$ = new Subject<CrearProducto>();

  creacion$: Observable<string> =
  this.crearProducto$.pipe(
    switchMap(producto =>
      this.productoService.crear(producto).pipe(
        tap(() => {
          this.recargar.update(valor => valor + 1);
        }),
        map(() => 'Producto creado correctamente.'),
        catchError(error => {
          console.error(
            'Error al crear el producto',
            error
          );
          return of(
            'No se pudo crear el producto.'
          );
        })
      )
    )
  );
mostrarFormularioCrear(): void {
  this.productoNuevo.set(true);
  this.tituloNuevo.set('');
  this.precioNuevo.set(0);
  this.descripcionNueva.set('');
  this.imagenNueva.set('');
  this.categoriaNueva.set(null);
}

cancelarCrear(): void {
  this.productoNuevo.set(false);
}

crearProducto(): void {
  const categoria = this.categoriaNueva();
  if (!categoria) {
    return;
  }
  const producto: CrearProducto = {
    title: this.tituloNuevo(),
    price: this.precioNuevo(),
    description: this.descripcionNueva(),
    images: [this.imagenNueva()],
    categoryId: categoria
  };
  this.crearProducto$.next(producto);
  this.productoNuevo.set(false);
}



  private actualizarProducto$ = new Subject<{
  id: number;
  cambios: ActualizarProducto;
  }>();

  actualizacion$: Observable<string> =
  this.actualizarProducto$.pipe(
    switchMap(({ id, cambios }) =>
      this.productoService.actualizar(id, cambios).pipe(
        tap(() => {
          this.recargar.update(valor => valor + 1);
        }),
        map(() => 'Producto actualizado correctamente.'),
        catchError(error => {
          console.error(
            'Error al actualizar el producto',
            error
          );
          return of(
            'No se pudo actualizar el producto.'
          );
        })
      )
    )
  );

  guardarEdicion(): void {
    const producto = this.productoEditando();
    if (!producto) {
      return;
    }
    const cambios: ActualizarProducto = {
    title: this.tituloEdicion(),
    price: this.precioEdicion(),
    description: producto.description,
    images: producto.images,
    categoryId: producto.category.id
  };
    this.actualizarProducto$.next({
      id: producto.id,
      cambios
    });
    this.productoEditando.set(null);
  }
  cancelarEdicion(): void {
    this.productoEditando.set(null);
  }

  rolActual = signal<'admin' | 'customer'>('customer');

  cantidadCarrito = this.carritoService.cantidad;

  totalCarrito = this.carritoService.total;

  onAgregarAlCarrito(producto: Producto): void {
    this.carritoService.agregar(producto);
  }

  cambiarRol(): void {
    this.rolActual.update(rol =>
      rol === 'admin' ? 'customer' : 'admin'
    );
  }

  onEditar(producto: Producto): void {
    this.productoEditando.set(producto);

    this.tituloEdicion.set(producto.title);
    this.precioEdicion.set(producto.price);
    this.stockEdicion.set(producto.stock);
  }

  onEliminar(producto: Producto): void {
    this.eliminarProducto$.next(producto.id);
  }

  trackById(
    index: number,
    producto: Producto
  ): number {
    return producto.id;
  }
}