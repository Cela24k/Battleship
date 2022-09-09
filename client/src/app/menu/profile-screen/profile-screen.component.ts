import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StatsInterface, UserHttpService, UserInterface } from 'src/app/user-http.service';

@Component({
  selector: 'app-profile-screen',
  templateUrl: './profile-screen.component.html',
  styleUrls: ['./profile-screen.component.css']
})
export class ProfileScreenComponent implements OnInit {
  userData: UserInterface = {
    _id: '',
    username: '',
    stats: {
      wins: 0,
      losses: 0,
      winstreak: 0,
      maxWinstreak: 0,
      elo: 0,
      playedGames: 0,
      shotsFired: 0,
      shotsHit: 0,
      timePlayed: '',
      rank: 0,
      _id: ''
    },
    state: 'Offline'
  }

  constructor(private httpservice: UserHttpService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.httpservice.getMe().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (e) => {
        console.log(e);
      },
    })
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

  accuracy(x: number, y: number): number {
    return x/y;
  }

  formatDate(): string{
    const date = new Date(this.userData.stats.timePlayed);
    const secondsDiff = date.getTime()/1000;
    const seconds = Math.floor(secondsDiff%60);
    const minutesDiff = Math.floor(secondsDiff/60);
    const minutes = minutesDiff%60;
    let secondsAsString = seconds < 10 ? "0" + seconds : seconds;
    let minutesAsString = minutes < 10 ? "0" + minutes : minutes;
    const hoursDiff = Math.floor(minutesDiff/60);
    const hours = hoursDiff%24;

    return hours + ' h ' + minutesAsString + ' m ' + secondsAsString + ' s';
  }
}
