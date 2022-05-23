import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
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

    return this.http.post(this.url + '/register', body, options).pipe(
      tap((data) => {
        console.log(JSON.stringify(data) + 'auth service');
      }));;
  }

  login(username: string, password: string) {
    let options = {
      headers: new HttpHeaders({
        authorization: 'Basic' + btoa(username + ':' + password),//TODO vedere se funziona l'authorization o come farla giusta
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      })
    };

    return this.http.post(this.url + '/login', options).pipe(//TODO qui dobbiamo settare il token nel local storage
      tap((data) => {
        console.log(JSON.stringify(data) + 'Login effettuato');

      }));;
  }

}
