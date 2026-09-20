import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (
  peticion,
  siguiente
) => {
  const token = inject(AuthService).obtenerToken();
  if (!token) {
    return siguiente(peticion);
  }
  const peticionConToken = peticion.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return siguiente(peticionConToken);
};