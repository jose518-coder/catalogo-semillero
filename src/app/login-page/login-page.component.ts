import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);

  usuario = signal('');
  clave = signal('');

  error = signal<string | null>(null);

  iniciarSesion(): void {
    this.error.set(null);
    const correcto =
      this.auth.iniciarSesion(
        this.usuario(),
        this.clave()
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