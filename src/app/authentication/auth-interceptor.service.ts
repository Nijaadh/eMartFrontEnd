import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
const TOKEN_HEADER_KEY = 'Authorization'; 
@Injectable({
  providedIn: 'root'
})

export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    return next.handle(req);



    // let authReq = req;
    // if (token != null) {
    //   // for Spring Boot back-end
    //   authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    //   // for Node.js Express back-end
    //   // authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    // }
    // return next.handle(authReq);
  }
}
