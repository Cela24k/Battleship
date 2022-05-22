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
        'Content-Type':  'application/json',
      }),
    };
    // let body = new URLSearchParams();// per riuscire a passare il body bisogna creare dei reqparams e passare body.toString
    // body.set('username', username);
    // body.set('password', password);
    // body.set('email', email);
    let body = {
      username ,
      email,
      password
    }
    
    
    //debugger;
    //l'errore dovrebbe essere dato dal tipo di ritorno del body della response, httpclient si aspetta un JSON qui spiega bene come funziona x-www-form-urlencoded https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data 
    return this.http.post(this.url + '/register', body, options).pipe(
      tap( (data) => {
        console.log(JSON.stringify(data) + 'auth service');
      }));;
  }

}
