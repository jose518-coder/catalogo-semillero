import { Injectable, inject, signal } from '@angular/core';
import {HttpClient } from '@angular/common/http';
import {catchError , map, Observable , of} from 'rxjs';
import { Producto } from '../models/producto';
import { CrearProducto } from '../models/crear-producto';
import { ActualizarProducto } from '../models/ActualizarProducto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  readonly error =
    signal<string | null>(null);

  private http = inject(HttpClient);

  private apiUrl =
    `${environment.apiUrl}/productos`;

  obtenerTodos(
    categoryId?: number,
    pagina?: number
  ): Observable<Producto[]> {

    this.error.set(null);

    return this.http
      .get<Producto[]>(
        this.apiUrl
      )
      .pipe(
        map(productos => {
          const filtrados = categoryId === undefined
            ? productos
            : productos.filter(producto => producto.categoriaId === categoryId);
          if (pagina === undefined) return filtrados;
          const limite = 10;
          const inicio = (pagina - 1) * limite;
          return filtrados.slice(inicio, inicio + limite);
        }),
        catchError(error => {
          console.error(
            'Error al cargar productos',
            error
          );
          this.error.set(
            'No se pudieron cargar los productos.'
          );
          return of([]);
        })
      );
  }

  obtenerPorId(
    id: number
  ): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(
    producto: CrearProducto
  ): Observable<Producto> {
    return this.http.post<Producto>(
      this.apiUrl,
      producto
    );
  }

  actualizar(
    id: number,
    cambios: ActualizarProducto
  ): Observable<Producto> {
    return this.http.put<Producto>(
      `${this.apiUrl}/${id}`,
      cambios
    );
  }

  eliminar(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
