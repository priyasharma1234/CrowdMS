import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordReg {
  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    //HOW TO USE
    //[Validators.required, PasswordReg.patternValidator( /\d{2}[A-Za-z]{5}\d{4}[A-Za-z]{1}[A-Za-z\d]{1}[Zz]{1}[A-Za-z\d]{1}/, { wrongPattern: true } )]
    //GSTIN /\d{2}[A-Za-z]{5}\d{4}[A-Za-z]{1}[A-Za-z\d]{1}[Zz]{1}[A-Za-z\d]{1}/
    //PAN   /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    //Udyogno   /[A-Za-z]{2}\d{2}[A-Za-z]{1}\d{7}/

    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }
      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);
      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }
  static passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password')?.value; // get password from our password form control
    const confirmPassword: string = control.get('confirmPassword')?.value; // get password from our confirmPassword form control
    // compare is the password math
    if (password !== confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('confirmPassword')?.setErrors({ NoPassswordMatch: true });
    }
  }
  static passwordNotSameValidator(control: AbstractControl) {
    const password: string = control.get('oldPassword')?.value; // get password from our password form control
    const confirmPassword: string = control.get('password')?.value; // get password from our confirmPassword form control
    // compare is the password math
    if (password === confirmPassword) {
      // if they don't match, set an error in our confirmPassword form control
      control.get('password')?.setErrors({ NoPassswordSame: true });
    }
  }
}
