import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClimaComponent } from './pages/clima/clima.component';
import { LoginComponent } from './pages/login/login.component';
import { Page404Component } from './pages/page404/page404.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthGuard } from './security/auth.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuard], component: ClimaComponent },
  { path: 'registrarse', component: RegistroComponent },
  { path: 'ingresar', component: LoginComponent },
  { path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
