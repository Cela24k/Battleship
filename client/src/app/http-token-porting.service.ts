import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
// https://www.syncfusion.com/blogs/post/best-practices-for-jwt-authentication-in-angular-apps.aspx
export class HttpTokenPortingService implements HttpInterceptor{

  constructor(private ls: LocalStorageService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.ls.get('token');
    if(req.url === 'http://localhost:8080/auth/login') return next.handle(req);
    req = req.clone({
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(req);
  }
}
