import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, finalize } from 'rxjs';

import { AuthService } from '../shared/services';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService, private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: this.authService.getAuthorizationHeaders(),
    });

    
    //return next.handle(req);

    this.loader.show();
    return next.handle(req).pipe(
      finalize(() => {
        this.loader.hide();
      }));
  }
}
