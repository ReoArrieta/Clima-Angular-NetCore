import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClimaRequest } from 'src/app/models/request/ClimaRequest';
import { AuthService } from 'src/app/services/auth.service';
import { ClimaService } from 'src/app/services/clima.service';
import { DialogDeleteComponent } from 'src/app/shared/dialogdelete/dialogdelete.component';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.component.html',
  styleUrls: ['./clima.component.scss'],
})
export class ClimaComponent implements OnInit {
  constructor(
    private _climaService: ClimaService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _apiAuth: AuthService,
  ) {}

  ngOnInit(): void {
    this.read();
  }

  displayedColumns: string[] = [
    'id',
    'descripcion',
    'usuario',
    'fecha',
    'acciones',
  ];
  readonly width: string = '410px';

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  read() {
    this._climaService.read().subscribe((res) => {
      this.dataSource.data = res.data;
    });
  }

  openCreate() {
    const dialogRef = this._dialog.open(DialogComponent, {
      width: this.width,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.read();
    });
  }

  openUpdate(model: ClimaRequest) {
    const dialogRef = this._dialog.open(DialogComponent, {
      width: this.width,
      data: model,
    });
    dialogRef.afterClosed().subscribe((res) => {
      this.read();
    });
  }

  delete(model: ClimaRequest) {
    const dialogRef = this._dialog.open(DialogDeleteComponent, {
      width: '238.1px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._climaService.delete(model.id).subscribe((res) => {
          if (res.exito) {
            this._snackBar.open('Radicado eliminado con éxito', '', {
              duration: 5000,
              horizontalPosition: 'left',
            });
            this.read();
          }
        });
      }
    });
  }

  cerrarSesion(){
    this._apiAuth.logout();
  }
}
