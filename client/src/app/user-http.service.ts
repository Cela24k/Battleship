import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';

export interface StatsInterface {
  wins: number,
  losses: number,
  winstreak: number,
  maxWinstreak: number,
  elo: number,
  playedGames: number,
  shotsFired: number,
  shotsHit: number,
  timePlayed: string,
  rank: number,
  _id: string
}

export interface UserInterface {
  _id: string,
  username: string,
  stats: StatsInterface,
  state: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {
  private url: string = 'http://localhost:8080/user';

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) { }

  // getFriends(): Observable<UserInterface>
  getUsers(): Observable<any> {
    return this.httpclient.get(this.url);
  }

  getFriends(): Observable<any> {
    return this.httpclient.get(this.url + '/' + this.localstorage.getId() + '/friends');
  }

  getMe(): Observable<any> {
    return this.httpclient.get(this.url + '/' + this.localstorage.getId());
  }

  friendRequest(friendid: string): Observable<any> {
    return this.httpclient.put((this.url + '/' + this.localstorage.getId() + '/friends' + '/' + friendid), {});
  }

  getUserById(id: string): Observable<any> {
    return this.httpclient.get(this.url +'/'+ id);
  }
  

}
