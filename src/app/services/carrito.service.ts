import { Injectable, computed, signal } from '@angular/core';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly CLAVE = 'carrito_wposs';
  private items = signal<Producto[]>([]);
  readonly productos = this.items.asReadonly();
  readonly cantidad = computed(() =>
    this.items().length
  );
  readonly total = computed(() =>
    this.items().reduce(
      (suma, producto) => suma + producto.price,
      0
    )
  );

  constructor() {
    try {
      const guardado = localStorage.getItem(this.CLAVE);
      if (guardado) {
        const datos: unknown = JSON.parse(guardado);
        if (Array.isArray(datos)) {
          this.items.set(datos as Producto[]);
        } else {
          this.items.set([]);
        }
      }
    } catch (error) {
      console.error(
        'No se pudo recuperar el carrito',
        error
      );
      this.items.set([]);
    }
  }

  private persistir(): void {
    try {
      localStorage.setItem(
        this.CLAVE,
        JSON.stringify(this.items())
      );
    } catch (error) {
      console.error(
        'No se pudo guardar el carrito',
        error
      );
    }
  }

  agregar(producto: Producto): void {
    this.items.update(lista => [
      ...lista,
      producto
    ]);
    this.persistir();
  }

  quitar(id: number): void {
    this.items.update(
      lista =>
        lista.filter(producto => producto.id !== id)
    );

    this.persistir();
  }

  vaciar(): void {
    this.items.set([]);
    this.persistir();
  }
}