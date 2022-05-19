import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) {  } 
  url = 'https://localhost:8080/auth'
  
  register(username: string, email: string, password: string){
    let options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/x-www-form-urlencoded',
      }),
    };
    let body = {
      username: username,
      email: email,
      password: password,
    }
    console.log('Class AuthService sending this request: ' + options +''+ body +''+ this.url);

    //questo passaggio va in errore 
    return this.http.post(this.url + '/register', body, options);
  }

}
