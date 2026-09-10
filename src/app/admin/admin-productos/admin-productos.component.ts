import { CommonModule } from '@angular/common';
import { Component, inject , signal } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { CrearProducto } from '../../models/crear-producto';
import { ActualizarProducto } from '../../models/ActualizarProducto';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { TablaProductosComponent } from '../../tabla-productos/tabla-productos.component';
import { PuedeSalir} from '../../guards/cambios-sin-guardar.guard';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    TablaProductosComponent
  ],
  templateUrl:
    './admin-productos.component.html',
  styleUrl:
    './admin-productos.component.css'
})
export class AdminProductosComponent
  implements PuedeSalir {

  private productoService =
    inject(ProductoService);

  private categoriaService =
    inject(CategoriaService);

  
  private recargar$ =
    new Subject<void>();

  productos$:
    Observable<Producto[]> =
    this.recargar$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.productoService
          .obtenerTodos()
      )
    );

  
  categorias$:
    Observable<Categoria[]> =
    this.categoriaService
      .obtenerTodas()
      .pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true
        })
      );

 
  productoEditando =signal<Producto | null>(null);
  productoNuevo =signal(false);
  titulo =signal('');
  precio =signal(0);
  descripcion =signal('');
  imagen =signal('');
  categoria =signal<number | null>(null);
  hayCambiosSinGuardar =signal(false);

  
  private crearProducto$ =
    new Subject<CrearProducto>();

  creacion$:
    Observable<string> =
    this.crearProducto$.pipe(
      switchMap(producto =>
        this.productoService
          .crear(producto)
          .pipe(
            tap(() => {
              this.recargar$.next();
              this.productoNuevo
                .set(false);
              this.hayCambiosSinGuardar
                .set(false);
            }),
            map(() =>
              'Producto creado correctamente.'
            ),
            catchError(error => {
              console.error(
                'Error al crear producto',
                error
              );
              return of(
                'No se pudo crear el producto.'
              );
            })
          )
      )
    );

  
  private actualizarProducto$ =
    new Subject<{
      id: number;
      cambios: ActualizarProducto;
    }>();

  actualizacion$:
    Observable<string> =
    this.actualizarProducto$.pipe(
      switchMap(({ id, cambios }) =>
        this.productoService
          .actualizar(id, cambios)
          .pipe(
            tap(() => {
              this.recargar$.next();
              this.productoEditando
                .set(null);
              this.hayCambiosSinGuardar
                .set(false);
            }),
            map(() =>
              'Producto actualizado correctamente.'
            ),
            catchError(error => {
              console.error(
                'Error al actualizar producto',
                error
              );
              return of(
                'No se pudo actualizar el producto.'
              );
            })
          )
      )
    );

  
  private eliminarProducto$ =
    new Subject<number>();

  eliminacion$:
    Observable<string> =
    this.eliminarProducto$.pipe(
      switchMap(id =>
        this.productoService
          .eliminar(id)
          .pipe(
            tap(() => {
              this.recargar$.next();
            }),
            map(() =>
              'Producto eliminado correctamente.'
            ),
            catchError(error => {
              console.error(
                'Error al eliminar producto',
                error
              );
              return of(
                'No se pudo eliminar el producto.'
              );
            })
          )
      )
    );

  
  mostrarNuevo(): void {
    this.productoNuevo.set(true);
    this.titulo.set('');
    this.precio.set(0);
    this.descripcion.set('');
    this.imagen.set('');
    this.categoria.set(null);
    this.hayCambiosSinGuardar.set(false);
  }

  cancelarNuevo(): void {
    this.productoNuevo.set(false);
    this.hayCambiosSinGuardar
      .set(false);
  }

  editar(producto: Producto): void {
    this.productoEditando.set(producto);
    this.titulo.set(producto.title);
    this.precio.set(producto.price);
    this.descripcion.set(producto.description);
    this.imagen.set(producto.images[0] ?? '');
    this.categoria.set(producto.category.id);
    this.hayCambiosSinGuardar.set(false);
  }
  cancelarEdicion(): void {
    this.productoEditando.set(null);
    this.hayCambiosSinGuardar.set(false);
  }

  marcarCambio(): void {
    this.hayCambiosSinGuardar.set(true);
  }

  
  crear(): void {
    const categoria =
      this.categoria();
    if (!categoria) {
      return;
    }

    const producto: CrearProducto = {
      title: this.titulo(),
      price: this.precio(),
      description: this.descripcion(),
      images: [this.imagen()],
      categoryId: categoria
    };

    this.crearProducto$.next(producto);
  }

  
  guardar(): void {
    const producto = this.productoEditando();
    if (!producto) {
      return;
    }

    const cambios:
      ActualizarProducto = {
      title: this.titulo(),
      price: this.precio(),
      description: this.descripcion(),
      images: [this.imagen()],
      categoryId: this.categoria() ?? undefined
    };

    this.actualizarProducto$
      .next({
        id: producto.id,
        cambios
      });
  }

 
  eliminar(producto: Producto): void {
    this.eliminarProducto$
      .next(producto.id);
  }

  
  puedeSalir(): boolean {
    return !this.hayCambiosSinGuardar();
  }

  
  trackById(
    index: number,
    producto: Producto
  ): number {
    return producto.id;
  }
}