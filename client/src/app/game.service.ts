import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private matchmaking_url: string = 'http://localhost:8080/matchmaking';
  private match_url: string = 'http://localhost:8080/match';

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) { }

  joinQueue(): Observable<any>{
    return this.httpclient.post(this.matchmaking_url + '/join', {userId: this.localstorage.getId()});
  }

  removeQueue(): Observable<any>{
    return this.httpclient.delete(this.matchmaking_url + '/join', {body:{userId: this.localstorage.getId()}});
  }
}