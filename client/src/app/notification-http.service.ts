import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatMap, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationHttpService {
  url: string;

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) {
    this.url = environment.apiUrl +'/user';
  }

  getNotifications(): Observable<any> { 
    return this.httpclient.get(this.url + '/' + this.localstorage.getId() + '/notifications');
  }

  accept(id: string): Observable<any>{
    return this.httpclient.put(this.url + '/' + this.localstorage.getId() + '/notifications/' + id +  '?action=accept',{});
  }

  refuse(id: string): Observable<any>{
    return this.httpclient.put(this.url + '/' + this.localstorage.getId() + '/notifications/' + id +  '?action=refuse',{});
  }

}
