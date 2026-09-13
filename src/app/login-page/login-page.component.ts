import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  formulario = this.fb.nonNullable.group({
    usuario: ['', Validators.required],
    clave: ['', Validators.required]
  });

  error = signal<string | null>(null);

  iniciarSesion(): void {
    this.error.set(null);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const datos = this.formulario.getRawValue();
    const correcto =
      this.auth.iniciarSesion(
        datos.usuario,
        datos.clave
      );
    if (!correcto) {
      this.error.set(
        'Usuario o contraseña incorrectos.'
      );
      return;
    }
    const volverA =
      this.ruta.snapshot.queryParamMap.get('volverA');
    if (volverA) {
      this.router.navigateByUrl(volverA);
    } else {
      this.router.navigate(['/productos']);
    }
  }
}
