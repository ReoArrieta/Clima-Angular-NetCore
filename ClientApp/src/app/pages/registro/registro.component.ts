import { Component } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { UserRequest } from 'src/app/models/request/UserRequest';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {

  public passwordsProhibidos: string[] = ['12345678', 'quertyui', '87654321'];
  public loading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _authService: AuthService
  ) {}

  formSignup = this._fb.group({
    nombre: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('[a-zA-z ]+'),
      ],
    ],
    apellido: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern('[a-zA-z ]+'),
      ],
    ],
    correo: [
      '',
      {
        validators: [
          Validators.required,
          Validators.pattern(/\S+@\S+\.\S+/),
          Validators.minLength(11),
          Validators.maxLength(50),
          this.mailValidation(),
        ],
        asyncValidators: [this.singleEmail()],
        updateOn: 'blur',
      },
    ],
    repetirCorreo: ['', [Validators.required, this.repeatMailValidation()]],
    contraseña: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30),
        this.passwordValidation(),
      ],
    ],
    repetirContraseña: [
      '',
      [Validators.required, this.repeatPasswordValidation()],
    ],
  });

  signup(model: UserRequest) {
    if (this.formSignup.valid) {
      this.loading = true;
      this._authService.signup(model).subscribe((res) => {
        if (res.exito) {
          this._snackBar.open(
            'Registro satisfactorio, bienvenido',
            '',
            {
              duration: 3500,
            }
          );
          this._router.navigate(['/ingresar']);
        }
        else {
          alert('Error, Intente más tarde');
        }
      });
    }
  }

  //#region validators

  mailValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const email = <string>control.value;

      if (!email) return {};

      if (email.indexOf(' ') >= 0) {
        return {
          mailValidation: {
            message: 'No debe de contener espacios',
          },
        };
      }

      if (!this.formSignup.controls?.['repetirCorreo'].value) return {};

      if (email != this.formSignup.controls?.['repetirCorreo'].value) {
        return {
          mailValidation: {
            message: 'No coincide',
          },
        };
      }

      return {};
    };
  }

  repeatMailValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      const email = <string>control.value;

      if (!email) return {};

      if (email != this.formSignup.controls?.['correo'].value) {
        return { repeatMailValidation: true };
      }

      return null;
    };
  }

  passwordValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors => {
      const password = <string>control.value;

      if (!password) return {};

      if (this.passwordsProhibidos.indexOf(password) !== -1) {
        return {
          passwordValidation: { message: 'Escoge un mejor contraseña' },
        };
      }

      if (password.indexOf(' ') >= 0) {
        return {
          passwordValidation: {
            message: 'No debe de contener espacios',
          },
        };
      }

      if (password === password.toLowerCase()) {
        return {
          passwordValidation: {
            message: 'Debe de contener mayúsculas',
          },
        };
      }

      if (password === password.toUpperCase()) {
        return {
          passwordValidation: {
            message: 'Debe de contener minúsculas',
          },
        };
      }

      if (!/\d/.test(password)) {
        return {
          passwordValidation: {
            message: 'Debe de contener numéros',
          },
        };
      }

      if (!this.formSignup.controls?.['repetirContraseña'].value) return {};

      if (password != this.formSignup.controls?.['repetirContraseña'].value) {
        return {
          passwordValidation: {
            message: 'No coinciden',
          },
        };
      }

      return {};
    };
  }

  repeatPasswordValidation(): ValidatorFn {
    return (control: AbstractControl) => {
      const password = <string>control.value;

      if (!password) return {};

      if (password != this.formSignup.controls?.['contraseña'].value) {
        return { repeatPasswordValidation: true };
      }

      return null;
    };
  }

  //#endregion

  //#region asyncValidators

  singleEmail(): AsyncValidatorFn {
    return (
      control: AbstractControl
    ): Promise<ValidationErrors> | Observable<ValidationErrors> => {
      const email = control.value;

      return this._authService.getEmail(email).pipe(
        map((res) => {
          if (res.exito) return { singleEmail: true };
          return {};
        })
      );
    };
  }

  //#endregion

  //#region getFB

  formValue(value: string) {
    return this.formSignup.get(value);
  }

  //#endregion
}
