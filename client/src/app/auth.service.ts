import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) {  } 
  url = 'http://localhost:8080/auth'

  register(username: string, email: string, password: string): Observable<any>  {
    let options = {
      headers: new HttpHeaders({
        //authorization: 'Basic' + btoa( username+':'+email+':'+password),
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      }),
    };
    let body = new URLSearchParams();// per riuscire a passare il body bisogna creare dei reqparams e passare body.toString
    body.set('username', username);
    body.set('password', password);
    body.set('email', email);
    
    
    //debugger;
    //questo passaggio va in errore, non arriva sta post
    return this.http.post(this.url + '/register', body.toString(), options).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) + 'auth service');
      }));;
  }

}
