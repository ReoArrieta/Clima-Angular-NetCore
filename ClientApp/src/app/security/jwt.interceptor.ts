import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtIntepceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}

  intercept(
    res: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this._authService.userData;

    if (user) {
      res = res.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
    }
    return next.handle(res);
  }
}
