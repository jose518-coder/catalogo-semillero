import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, catchError, map, of } from 'rxjs';

export interface VerificadorCorreo {
  correoEstaDisponible(correo: string): Observable<boolean>;
}

export function correoDisponible(verificador: VerificadorCorreo): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const correo = String(control.value ?? '').trim();

    if (!correo) {
      return of(null);
    }

    return verificador.correoEstaDisponible(correo).pipe(
      map(disponible => disponible ? null : { correoNoDisponible: true }),
      catchError(() => of({ correoNoVerificado: true }))
    );
  };
}