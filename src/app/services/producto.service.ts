import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Producto } from '../models/producto';
import { CrearProducto } from '../models/crear-producto';
import { ActualizarProducto } from '../models/ActualizarProducto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  readonly error = signal<string | null>(null);
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  
  obtenerTodos(categoryId?: number): Observable<Producto[]> {
    this.error.set(null);
    const peticion = categoryId !== undefined
    ? this.http.get<Producto[]>(
        `${this.apiUrl}?categoryId=${categoryId}`
      )
    : this.http.get<Producto[]>(this.apiUrl);
    return peticion.pipe(
      catchError((error) => {
      console.error('Error al cargar productos', error);
      this.error.set('No se pudieron cargar los productos.');
      return of([]);
      })
    );
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(
      `${this.apiUrl}/${id}`
    );
  }

  crear(producto: CrearProducto): Observable<Producto> {
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

  eliminar(id: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.apiUrl}/${id}`
    );
  }
}