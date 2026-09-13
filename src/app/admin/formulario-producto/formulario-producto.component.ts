import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';

import { Categoria } from '../../models/categoria';
import { CrearProducto } from '../../models/crear-producto';
import { ActualizarProducto } from '../../models/ActualizarProducto';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { PuedeSalir } from '../../guards/cambios-sin-guardar.guard';
import { noSoloEspacios } from '../../validators/no-solo-espacios.validator';

@Component({
  selector: 'app-formulario-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulario-producto.component.html',
  styleUrl: './formulario-producto.component.css'
})
export class FormularioProductoComponent implements PuedeSalir {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private destroyRef = inject(DestroyRef);

  readonly mensajeErrorCategorias = signal<string | null>(null);
  readonly cargandoCategorias = signal(true);

  readonly categorias$: Observable<Categoria[]> =
    this.categoriaService.obtenerTodas().pipe(
      tap(() => this.cargandoCategorias.set(false)),
      catchError(error => {
        console.error('Error al cargar las categorías', error);
        this.cargandoCategorias.set(false);
        this.mensajeErrorCategorias.set(
          'No se pudieron cargar las categorías.'
        );
        return of([]);
      })
    );

  readonly cargando = signal(false);
  readonly mensajeError = signal<string | null>(null);
  readonly esEdicion = signal(false);
  readonly productoCargado = signal(false);
  readonly caracteresRestantes = signal(500);

  private productoId: number | null = null;

  formulario = this.fb.nonNullable.group({
    codigo: [
      {
        value: 0,
        disabled: true
      }
    ],
    titulo: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        noSoloEspacios()
      ]
    ],
    precio: [
      0,
      [
        Validators.required,
        Validators.min(0.01)
      ]
    ],
    descripcion: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(500),
        noSoloEspacios()
      ]
    ],
    categoriaId: [
      0,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],
    imagenes: this.fb.array(
      [this.crearImagen()],
      Validators.minLength(1)
    )
  });

  constructor() {
    this.formulario.controls.descripcion.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(descripcion => {
        this.caracteresRestantes.set(
          500 - descripcion.length
        );
      });
  }

  crearImagen(valor = ''): FormControl<string> {
    return this.fb.nonNullable.control(
      valor,
      [
        Validators.required
      ]
    );
  }

  get imagenes(): FormArray<FormControl<string>> {
    return this.formulario.controls.imagenes;
  }

  agregarImagen(): void {
    this.imagenes.push(
      this.crearImagen()
    );
  }

  eliminarImagen(indice: number): void {
    if (this.imagenes.length > 1) {
      this.imagenes.removeAt(indice);
    }
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(parametros => {
        const id = Number(
          parametros.get('id')
        );

        
        if (!Number.isInteger(id) || id <= 0) {
          this.productoId = null;
          this.esEdicion.set(false);
          this.productoCargado.set(true);
          return;
        }
        this.productoId = id;
        this.esEdicion.set(true);
        this.productoCargado.set(false);
        this.cargarProducto(id);
      });
  }

  private cargarProducto(id: number): void {
    this.cargando.set(true);
    this.mensajeError.set(null);
    this.productoService.obtenerPorId(id).subscribe({
      next: producto => {
        this.formulario.patchValue({
          codigo: producto.id,
          titulo: producto.title,
          precio: producto.price,
          descripcion: producto.description,
          categoriaId: producto.category.id
        });

        this.imagenes.clear();

        producto.images.forEach(imagen => {
          this.imagenes.push(
            this.crearImagen(imagen)
          );
        });

        if (this.imagenes.length === 0) {
          this.agregarImagen();
        }
        this.formulario.markAsPristine();
        this.productoCargado.set(true);
        this.cargando.set(false);
      },

      error: error => {
        console.error(
          'Error al cargar el producto',
          error
        );
        this.mensajeError.set(
          'No se pudo cargar el producto.'
        );
        this.productoCargado.set(false);
        this.cargando.set(false);
      }
    });
  }

  guardar(): void {
    if (!this.productoCargado()) {
      return;
    }

    
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.desplazarAlPrimerError();
      return;
    }

    const datos = this.formulario.getRawValue();

    const producto: CrearProducto = {
      title: datos.titulo.trim(),
      price: datos.precio,
      description: datos.descripcion.trim(),
      images: datos.imagenes.map(
        imagen => imagen.trim()
      ),
      categoryId: datos.categoriaId
    };
    this.cargando.set(true);
    this.mensajeError.set(null);
    const cambios: ActualizarProducto = {
      id: datos.codigo,
      ...producto
    };

    const solicitud$ =
      this.productoId === null
        ? this.productoService.crear(producto)
        : this.productoService.actualizar(
            this.productoId,
            cambios
          );
    solicitud$.subscribe({
      next: () => {
        this.formulario.markAsPristine();
        this.router.navigate(
          ['/admin/productos']
        );
      },

      error: error => {
        console.error(
          'Error al guardar el producto',
          error
        );
        this.mensajeError.set(
          'No se pudo guardar el producto. Inténtalo de nuevo.'
        );
        this.cargando.set(false);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(
      ['/admin/productos']
    );
  }

  puedeSalir(): boolean {
    return !this.formulario.dirty || this.cargando();
  }

  private desplazarAlPrimerError(): void {
    setTimeout(() => {
      const primerError =
        document.querySelector<HTMLElement>(
          'form input.ng-invalid, ' +
          'form textarea.ng-invalid, ' +
          'form select.ng-invalid'
        );
      primerError?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      primerError?.focus();
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}