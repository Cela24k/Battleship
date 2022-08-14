import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, map, Observable } from 'rxjs';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ChatHttpService {
  url: string;

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) {
    this.url = 'http://localhost:8080';
  }

  getChats(): Observable<any> {
    return this.httpclient.get(this.url + '/chat/user/' + this.localstorage.getId());
  }

  getUser(id: string): Observable<any> {
    return this.httpclient.get(this.url + '/user/' + id);
  }
}
