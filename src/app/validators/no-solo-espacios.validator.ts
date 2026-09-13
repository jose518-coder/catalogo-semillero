import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noSoloEspacios(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = String(control.value ?? '');
    if (valor.trim().length === 0 && valor.length > 0) {
      return { soloEspacios: true };
    }
    return null;
  };
}