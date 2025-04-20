import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function userNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    return /test/i.test(value) ? { containsTest: { value } } : null;
  };
}
