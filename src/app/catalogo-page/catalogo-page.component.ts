import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Producto } from '../models/producto';
import { PRODUCTOS } from '../data/productos';
import { TarjetaProductoComponent } from '../tarjeta-producto/tarjeta-producto.component';
import { TablaProductosComponent } from '../tabla-productos/tabla-productos.component';


@Component({
  selector: 'app-catalogo-page',
  standalone: true,
  imports: [CommonModule,TarjetaProductoComponent,TablaProductosComponent],
  templateUrl: './catalogo-page.component.html',
  styleUrl: './catalogo-page.component.css'
})
export class CatalogoPageComponent {

  categoriaSeleccionada = signal('todas');
  rolActual = signal<'admin' | 'customer'>('customer');
  productos = signal(PRODUCTOS);
  carrito = signal<Producto[]>([]);
  cantidadCarrito = computed(() => this.carrito().length);
  
  totalCarrito = computed(() =>
    this.carrito().reduce(
      (total, producto) => total + producto.price,
      0
    )
  );

  onAgregarAlCarrito(producto: Producto) {
    this.carrito.update(carrito => [...carrito, producto]);
  }

  cambiarRol() {
  this.rolActual.update(rol =>
    rol === 'admin' ? 'customer' : 'admin'
  );
  }

  trackById(index: number, producto: Producto): number {
    return producto.id;
  }

  onEditar(producto: Producto) {
  console.log('Editar producto:', producto);
  }

  onEliminar(producto: Producto) {
  console.log('Eliminar producto:', producto);
  }

  productosFiltrados = computed(() => {
  const categoria = this.categoriaSeleccionada();

  if (categoria === 'todas') {
    return this.productos();
  }

  return this.productos().filter(
    producto => producto.category.name === categoria
  );
  });
  
}