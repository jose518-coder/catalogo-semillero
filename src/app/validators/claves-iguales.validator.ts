import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function clavesIguales(clave: string, confirmacion: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const claveControl = control.get(clave);
    const confirmacionControl = control.get(confirmacion);
    if (!claveControl || !confirmacionControl) return null;

    return claveControl.value === confirmacionControl.value
      ? null
      : { clavesDistintas: true };
  };
}
