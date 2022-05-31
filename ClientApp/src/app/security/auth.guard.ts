import { Injectable } from '@angular/core';

import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private _router: Router) {}

  canActivate(_router: ActivatedRouteSnapshot): boolean {
    const user = this._authService.userData.token;
    if (user) return true;
    this._router.navigate(['/ingresar']);
    return false;
  }
}
