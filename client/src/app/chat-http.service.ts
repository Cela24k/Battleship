import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
    return this.httpclient.get(this.url + '/user/' + this.localstorage.getId() + '/chats');
  }

  getUser(id: string): Observable<any> {
    return this.httpclient.get(this.url + '/user/' + id);
  }

  sendMessage(txt: string, sender: string, chatId: string, friendId?: string): Observable<any> {
    const body = { text: txt, sender };
    const token = this.localstorage.getToken();
    const options = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token ? token : ''}`,
      })
    }

    if (chatId) {
      return this.httpclient.post(this.url + '/chat/' + chatId + '/messages', body, options);
    }
    else 
      return this.httpclient.post(this.url + '/chat', {friendId, userId:sender, txt}, options);
    
  }
}
