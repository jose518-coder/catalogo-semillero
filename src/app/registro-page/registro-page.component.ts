import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { clavesIguales } from '../validators/claves-iguales.validator';
import { correoDisponible } from '../validators/correo-disponible.validator';
import { noSoloEspacios } from '../validators/no-solo-espacios.validator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registro-page',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registro-page.component.html',
  styleUrl: './registro-page.component.css'
})
export class RegistroPageComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly enviando = signal(false);
  readonly mensajeError = signal<string | null>(null);
  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3), noSoloEspacios()]],
    correo: ['',{validators: [Validators.required,Validators.email],asyncValidators: [correoDisponible(this.auth)],updateOn: 'blur'}],
    clave: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/(?=.*[A-Za-z])(?=.*\d)/)]],
    confirmacion: ['', Validators.required]
  }, { validators: clavesIguales('clave', 'confirmacion') });

  constructor() {
    this.formulario.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.mensajeError.set(null));
  }

  registrar(): void {
    if (this.formulario.invalid || this.formulario.pending) {
      this.formulario.markAllAsTouched();
      this.desplazarAlPrimerError();
      return;
    }

    this.enviando.set(true);
    const datos = this.formulario.getRawValue();
    this.auth.registrar({
      name: datos.nombre.trim(),
      email: datos.correo.trim(),
      password: datos.clave,
      avatar: 'https://i.pravatar.cc/300'
    }).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
      this.mensajeError.set(
      'No se pudo completar el registro. Inténtalo de nuevo.'
    );
    this.enviando.set(false);
}
    });
  }

  resetear(): void {
    this.formulario.reset();
    this.mensajeError.set(null);
  }

  private desplazarAlPrimerError(): void {
  setTimeout(() => {
    const primerError =
      document.querySelector<HTMLElement>(
        'form input.ng-invalid, ' +
        'form textarea.ng-invalid, ' +
        'form select.ng-invalid'
      );
    primerError?.scrollIntoView({behavior: 'smooth',block: 'center'});
    primerError?.focus();
  });
  }
}
