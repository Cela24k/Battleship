import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { StatsInterface, UserHttpService, UserInterface } from 'src/app/user-http.service';

@Component({
  selector: 'app-friend-stats',
  templateUrl: './friend-stats.component.html',
  styleUrls: ['./friend-stats.component.css']
})
export class FriendStatsComponent implements OnInit {

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
    state: ''
  }
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpservice: UserHttpService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.httpservice.getUserById(this.data).subscribe({
      next: (value) => {
        this.userData = value;
      },
      error(err) {
          
      },
    })
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
