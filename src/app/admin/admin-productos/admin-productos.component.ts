import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, startWith, switchMap } from 'rxjs/operators';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto.service';
import { TablaProductosComponent } from '../../tabla-productos/tabla-productos.component';
import { ConfirmarDialogComponent } from '../../confirmar-dialog/confirmar-dialog.component';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TablaProductosComponent
  ],
  templateUrl: './admin-productos.component.html',
  styleUrl: './admin-productos.component.css'
})
export class AdminProductosComponent {
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  private recargar$ = new Subject<void>();

  readonly cargando = signal(true);

  productos$: Observable<Producto[]> = this.recargar$.pipe(
    startWith(undefined),
    switchMap(() => {
      this.cargando.set(true);

      return this.productoService.obtenerTodos().pipe(
        finalize(() => {
          this.cargando.set(false);
        })
      );
    })
  );

  editar(producto: Producto): void {
    this.router.navigate([
      '/admin/productos',
      producto.id,
      'editar'
    ]);
  }

  eliminar(producto: Producto): void {
    const dialogRef = this.dialog.open(
      ConfirmarDialogComponent,
      {
        width: '400px',
        data: {
          nombre: producto.title
        }
      }
    );

    dialogRef.afterClosed().subscribe(confirmado => {
      if (!confirmado) {
        return;
      }

      this.productoService.eliminar(producto.id).subscribe({
        next: () => {
          this.recargar$.next();

          this.snackBar.open(
            'Producto eliminado correctamente.',
            'Cerrar',
            {
              duration: 3000
            }
          );
        },

        error: () => {
          this.snackBar.open(
            'No se pudo eliminar el producto.',
            'Cerrar',
            {
              duration: 4000
            }
          );
        }
      });
    });
  }
}