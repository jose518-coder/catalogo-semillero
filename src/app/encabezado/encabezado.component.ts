import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {Router , RouterLink, RouterLinkActive} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './encabezado.component.html',
  styleUrl: './encabezado.component.css'
})
export class EncabezadoComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.router.navigate(['/productos']);
  }
}