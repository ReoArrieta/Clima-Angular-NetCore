import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ClimaRequest } from 'src/app/models/request/ClimaRequest';
import { AuthService } from 'src/app/services/auth.service';
import { ClimaService } from 'src/app/services/clima.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    private _climaService: ClimaService,
    private _apiAuth: AuthService,
    @Inject(MAT_DIALOG_DATA) public clima: ClimaRequest
  ) {
    if (this.clima !== null) {
      const setClima = {
        id: clima.id,
        descripcion: clima.descripcion,
        usuario: this._apiAuth.userData.correo,
      };
      this.form.setValue(setClima);
    }
  }

  form = this._fb.group({
    id: 0,
    descripcion: ['', Validators.required],
    usuario: [this._apiAuth.userData.correo]
  });

  close() {
    this._dialogRef.close();
  }

  create(model: ClimaRequest) {
    if (this.form.valid) {
      this._climaService.create(model).subscribe((res) => {
        if (res.exito) {
          this._dialogRef.close();
          this._snackBar.open('Clima agregado con éxito', '', {
            duration: 3000,
            horizontalPosition: 'left',
          });
        } else {
          this._snackBar.open('Error -> Clima no agregado ', '', {
            duration: 3000,
            horizontalPosition: 'left',
          });
        }
      });
    }
  }

  update(model: ClimaRequest) {
    if (this.form.valid) {
      this._climaService.update(model).subscribe((res) => {
        if (res.exito) {
          this._dialogRef.close();
          this._snackBar.open('Clima editado con éxito', '', {
            duration: 3000,
            horizontalPosition: 'left',
          });
        } else {
          this._snackBar.open('Error -> Clima no editado', '', {
            duration: 3000,
            horizontalPosition: 'left',
          });
        }
      });
    }
  }

  //#region Get Fb
  formValue(value: string) {
    return this.form.get(value);
  }
  //#endregion

}
