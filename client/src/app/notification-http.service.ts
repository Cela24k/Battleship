import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, map, Observable } from 'rxjs';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpService {
  url: string;

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) {
    this.url = 'http://localhost:8080/user'
  }

  getNotifications(): Observable<any> { 
    //debugger;
    console.log(this.httpclient.get(this.url + '/' + this.localstorage.getId() + '/notifications').pipe(map(notification => console.log('qui + ' + notification) )));
    return this.httpclient.get(this.url + '/' + this.localstorage.getId() + '/notifications').pipe(map(notification => console.log('qui + ' + notification) ));
  }
}
