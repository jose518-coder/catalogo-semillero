import { CommonModule } from '@angular/common';
import {Component,inject,signal} from '@angular/core';
import {ActivatedRoute , Router , RouterLink} from '@angular/router';
import {Observable , combineLatest , finalize , switchMap} from 'rxjs';
import { Producto } from '../models/producto';
import { Categoria } from '../models/categoria';
import { ProductoService } from '../services/producto.service';
import { CategoriaService } from '../services/categoria.service';
import { CarritoService } from '../services/carrito.service';
import { TarjetaProductoComponent } from '../tarjeta-producto/tarjeta-producto.component';

@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TarjetaProductoComponent
  ],
  templateUrl: './catalogo-page.component.html',
  styleUrl: './catalogo-page.component.css'
})
export class CatalogoPageComponent {

  private ruta = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private carritoService = inject(CarritoService);

  cargando = signal(false);

  errorProductos =this.productoService.error;

  categoriaSeleccionada =signal<number | null>(null);
  paginaActual =signal<number>(1);

  categorias$:
    Observable<Categoria[]> =
    this.categoriaService
      .obtenerTodas();
      
  private recargar =signal(0);

  private recargar$ =
    new Observable<number>(
      subscriber => {
        subscriber.next(
          this.recargar()
        );
      }
    );

  productos$:
    Observable<Producto[]> =
    combineLatest([
      this.ruta.queryParamMap,
      this.recargar$
    ]).pipe(
      switchMap(([params]) => {
        const categoriaTexto =
          params.get('categoria');
        const paginaTexto =
          params.get('pagina');
        const categoria =
          categoriaTexto
            ? Number(categoriaTexto)
            : undefined;
        const pagina =
          paginaTexto
            ? Number(paginaTexto)
            : 1;
        this.categoriaSeleccionada.set(
          categoria ?? null
        );
        this.paginaActual.set(pagina);
        this.cargando.set(true);
        return this.productoService
          .obtenerTodos(
            categoria,
            pagina
          )
          .pipe(
            finalize(() =>
              this.cargando.set(false)
            )
          );
      })
    );

  cantidadCarrito =
    this.carritoService.cantidad;

  totalCarrito =
    this.carritoService.total;

  cambiarCategoria(
    valor: string
  ): void {
    const categoria =
      valor
        ? Number(valor)
        : null;
    this.router.navigate(
      ['/productos'],
      {
        queryParams: {
          categoria,
          pagina: null
        }
      }
    );
  }

  cambiarPagina(
    pagina: number
  ): void {
    this.router.navigate(
      ['/productos'],
      {
        queryParams: {
          categoria:
            this.categoriaSeleccionada(),
          pagina
        }
      }
    );
  }

  onAgregarAlCarrito(
    producto: Producto
  ): void {
    this.carritoService.agregar(
      producto
    );
  }

  trackById(
    index: number,
    producto: Producto
  ): number {
    return producto.id;
  }
}