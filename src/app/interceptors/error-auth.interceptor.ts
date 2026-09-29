import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const errorAuthInterceptor: HttpInterceptorFn = (
  peticion,
  siguiente
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return siguiente(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const esLogin =
        peticion.url.endsWith('/auth/login');
      const esRegistro =
        peticion.url.endsWith('/auth/registro');
      const esAutenticacionPublica =
        esLogin || esRegistro;
      const hayToken = auth.obtenerToken() !== null;
      if (
        error.status === 401 &&
        hayToken &&
        !esAutenticacionPublica
      ) {
        auth.cerrarSesion();
        router.navigate(['/login'], {
          queryParams: {
            expirada: true
          }
        });
      }
      return throwError(() => error);
    })
  );
};