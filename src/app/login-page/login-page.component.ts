import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  formulario = this.fb.nonNullable.group({
    correo: ['', [
      Validators.required,
      Validators.email
    ]],
    clave: ['', Validators.required]
  });

  error = signal<string | null>(null);
  cargando = signal(false);

  iniciarSesion(): void {
    this.error.set(null);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const datos = this.formulario.getRawValue();

    this.cargando.set(true);

    this.auth.iniciarSesion(
      datos.correo,
      datos.clave
    ).subscribe({
      next: () => {
        this.auth.cargarPerfil().subscribe({
          next: () => {
            this.cargando.set(false);
            this.redirigirDespuesDelLogin();
          },
          error: () => {
            this.auth.cerrarSesion();
            this.cargando.set(false);
            this.error.set(
              'Correo o contraseña incorrectos'
            );
          }
        });
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(
          'Correo o contraseña incorrectos'
        );
      }
    });
  }

  private redirigirDespuesDelLogin(): void {
    const volverA =
      this.ruta.snapshot.queryParamMap.get('volverA');

    if (volverA) {
      this.router.navigateByUrl(volverA);
      return;
    }

    this.router.navigate(['/productos']);
  }
}