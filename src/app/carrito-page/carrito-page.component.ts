import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../models/producto';
import { CarritoService } from '../services/carrito.service';

@Component({
  selector: 'app-carrito-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './carrito-page.component.html',
  styleUrl: './carrito-page.component.css'
})
export class CarritoPageComponent {
  private carrito = inject(CarritoService);
  productos = this.carrito.productos;
  cantidad = this.carrito.cantidad;
  total = this.carrito.total;
  quitar(id: number): void {
    this.carrito.quitar(id);
  }
  vaciar(): void {
    this.carrito.vaciar();
  }
  trackById(
  index: number,
  producto: Producto
): number {
  return producto.id;
}
}