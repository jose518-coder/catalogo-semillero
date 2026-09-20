import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-tabla-productos',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './tabla-productos.component.html',
  styleUrl: './tabla-productos.component.css'
})
export class TablaProductosComponent implements AfterViewInit {
  @Input({ required: true })
  set productos(valor: Producto[]) {
    this.dataSource.data = valor;
  }

  @Output() editar = new EventEmitter<Producto>();
  @Output() eliminar = new EventEmitter<Producto>();

  displayedColumns: string[] = [
    'id',
    'imagen',
    'titulo',
    'categoria',
    'precio',
    'acciones'
  ];

  dataSource = new MatTableDataSource<Producto>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

    ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  productosVacios(): boolean {
    return this.dataSource.data.length === 0;
  }
}