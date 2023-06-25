import { Inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { AuthService } from '../shared/services';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loader: LoaderService, private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loader.show();
    
    req = req.clone({
      setHeaders: this.authService.getAuthorizationHeaders(),
    });

    
    return next.handle(req).pipe(
      finalize(async () => {
        await this.delay(2000);
        this.loader.hide();
      }));
  }

  delay(time: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
}
