import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpTokenPortingService } from './http-token-porting.service';
import { LocalStorageService } from './local-storage.service';
import { BattleGrid, Cell } from './play-game/game-entities/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private matchmaking_url: string = 'http://localhost:8080/matchmaking';
  private match_url: string = 'http://localhost:8080/match';

  constructor(private httpclient: HttpClient, private localstorage: LocalStorageService, private auth: HttpTokenPortingService) { }

  joinQueue(): Observable<any> {
    return this.httpclient.post(this.matchmaking_url + '/join', { userId: this.localstorage.getId() });
  }

  removeQueue(): Observable<any> {
    return this.httpclient.delete(this.matchmaking_url + '/remove', { body: { userId: this.localstorage.getId() } });
  }

  initBoard(matchId: string, board: BattleGrid): Observable<any> {
    console.log("initiboard");
    console.log(board);
    return this.httpclient.post(this.match_url + "/" + matchId + "?action=init", { board: board, userId: this.localstorage.getId() })
  }

  shoot(matchId: string, shot: Cell ): Observable<any>{
    const body = {shot: shot, userId: this.localstorage.getId()};
    return this.httpclient.patch(this.match_url + '/' + matchId + '?action=move', body)
  }

  matchRequest(userId: string, friendId: string): Observable<any>{
    return this.httpclient.post(this.match_url, {});
  }
}
