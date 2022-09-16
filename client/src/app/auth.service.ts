import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of, map } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'//TODO capire dove far providare i servizi che abbiamo come DI
})

export class AuthService {
  constructor(private http: HttpClient, private localHelper: LocalStorageService) { }
  url = environment.apiUrl+'/auth';

  register(username: string, email: string, password: string): Observable<any> {
    let body = {
      username,
      email,
      password
    }

    return this.http.post<any>(this.url + '/register', body).pipe(
      tap((data) => {
        console.log(JSON.stringify(data) + 'auth service');
      }));;
  }

  login(username: string, password: string) {
    this.logOut();
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

  logOut() {
    if (this.isLoggedIn()) {
      console.log("logging out");
      this.localHelper.logOut();
    }
  }

  isLoggedIn() {
    if (this.localHelper.get('token') != null) return true;
    return false;
  }

  newMod(username: string, email: string, password: string) {
    let body = {
      username,
      email,
      password
    }

    return this.http.patch(this.url + '/' + this.localHelper.getId(), body)
  }

}
