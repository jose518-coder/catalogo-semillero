import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {ActivatedRoute , RouterLink} from '@angular/router';
import {Observable , combineLatest , map , switchMap} from 'rxjs';
import { Producto } from '../models/producto';
import { ProductoService } from '../services/producto.service';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css'
})
export class DetalleProductoComponent {
  private ruta = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  producto$: Observable<Producto> =
    this.ruta.paramMap.pipe(
      switchMap(params => {
        const id = Number(
          params.get('id')
        );
        return this.productoService
          .obtenerPorId(id);
      })
    );

  productosRelacionados$:
    Observable<Producto[]> =
    combineLatest([
      this.ruta.paramMap,
      this.productoService.obtenerTodos()
    ]).pipe(
      map(([params, productos]) => {
        const idActual = Number(
          params.get('id')
        );
        return productos
          .filter(
            producto =>
              producto.id !== idActual
          )
          .slice(0, 3);
      })
    );
  trackById(
    index: number,
    producto: Producto
  ): number {
    return producto.id;
  }
}