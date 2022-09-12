import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
    return next.handle(req).pipe(tap({
      next: (event: any) => {
        if (event instanceof HttpResponse) {
          if(event.status == 401) {
            window.location.href = "/login";
          }
        }
        return event;
      },
      error: (error: any) => {
        if(error.status == 401) {
          window.location.href = "/login";
        }
        if(error.status == 404) {
          alert('Page Not Found!!!');
          window.location.href = "/login";
        }
      }

    }
    ))
  }
}
