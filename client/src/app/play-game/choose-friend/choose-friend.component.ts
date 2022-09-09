import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatHttpService } from 'src/app/chat-http.service';
import { ChatListenerService } from 'src/app/chat-listener.service';
import { LocalStorageService } from 'src/app/local-storage.service';
import { UserHttpService } from 'src/app/user-http.service';
import { PlaySearchboxComponent } from './play-searchbox/play-searchbox.component';

@Component({
  selector: 'app-choose-friend',
  templateUrl: './choose-friend.component.html',
  styleUrls: ['./choose-friend.component.css']
})
export class ChooseFriendComponent implements OnInit {
  @Output() friendChosenEvent = new EventEmitter();
  constructor(private httpservice: UserHttpService, public dialog: MatDialog, private localstorage: LocalStorageService) { }

  ngOnInit(): void {
    this.fetchData();
    this.openDialog();
  }

  fetchData(): void {
    this.httpservice.getFriends().subscribe({
      next: (d) => {
        console.log(d)
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
      }
    })

  }

  openDialog() {
    const dialogRef = this.dialog.open(PlaySearchboxComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.friendChosenEvent.emit(result);
    });
  }
}
