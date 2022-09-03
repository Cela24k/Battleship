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
    playing: false
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
    return date.getHours().toString() + ' h ' + date.getMinutes().toString() + ' m ' + date.getSeconds().toString() + ' s';
  }
}
