import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthRequest } from 'src/app/models/request/AuthRequest';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public hide: boolean = false;
  public loading: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _apiAuth: AuthService
  ) {
    if (this._apiAuth.userData.token) this._router.navigate(['/']);
  }

  ngOnInit() {}

  formSignin = this._fb.group({
    correo: ['', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
    contraseña: ['', Validators.required],
  });

  signin(model: AuthRequest) {
    if (this.formSignin.valid) {
      console.log(this.formSignin.value);
      this.loading = true;
      this._apiAuth.signin(model).subscribe((res) => {
        if (res.exito) {
          this._snackBar.open(
            'Bienvenido ' + this._apiAuth.userData.correo,
            '',
            {
              duration: 3000,
            }
          );
          this._router.navigate(['/']);
        } else {
          this.loading = false;
          let snackBarRef = this._snackBar.open(
            'Correo y/o contraseña erronea.',
            'Registrate',
            {
              duration: 5000,
            }
          );
          snackBarRef.onAction().subscribe(() => {
            this._router.navigate(['/registrarse']);
          });
        }
      });
    }
  }

  get correo() {
    return this.formSignin.get('correo');
  }
}
