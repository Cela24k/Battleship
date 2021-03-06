import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of, map } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'//TODO capire dove far providare i servizi che abbiamo come DI
})

export class AuthService {
  constructor(private http: HttpClient, private localHelper: LocalStorageService) { }
  url = 'http://localhost:8080/auth'

  register(username: string, email: string, password: string): Observable<any> {
    let options = {
      headers: new HttpHeaders({
        //authorization: 'Basic' + btoa( username+':'+email+':'+password),
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };
    let body = {
      username,
      email,
      password
    }

    return this.http.post<any>(this.url + '/register', body, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data) + 'auth service');
      }));;
  }

  login(username: string, password: string) {
    let options = {
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(username + ':' + password)}`,
      }
    };
    
    return this.http.get<any>(this.url + '/login', options = options).pipe(
      map(user => {
        this.localHelper.set('token', user.token);
        console.log('Token settato in LocalStorage');
      })
    );
  }

}
