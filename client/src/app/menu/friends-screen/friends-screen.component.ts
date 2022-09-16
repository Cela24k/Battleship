import { Component, OnInit } from '@angular/core';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FriendStatsComponent } from './friends-screen-prev/friend-stats/friend-stats.component';

@Component({
  selector: 'app-friends-screen',
  templateUrl: './friends-screen.component.html',
  styleUrls: ['./friends-screen.component.css']
})
export class FriendsScreenComponent implements OnInit {
  friends: string[] = [];
  users: UserInterface[] = [];
  searchTerm: string = '';
  names: string[] = [];


  constructor(private httpservice: UserHttpService, private _snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.httpservice.getFriends().subscribe({
      next: (data) => {
        this.friends = data;
      },
      error: (e) => {
        console.log(e);
      },
    })
  }

  isEmpty(): boolean {
    return this.friends.length == 0;
  }

  addFriend(name: any) {
    const isFriend =  this.names.includes(name);

    if (!isFriend && name.length > 1) {
      let userid: string | undefined = undefined;

      this.httpservice.getUsers().subscribe({
        next: (data) => {
          this.users = data;
          let user = this.users.find((e)=> e.username == name)
          userid = user?._id;
        },
        error: (e) => {
          console.log(e)
        },
        complete: ()=>{
          if(userid)
            this.httpservice.friendRequest(userid).subscribe({
              next: (data) => {
              },
              error: (e) => {
                console.log(e)
              }
              ,
              complete: ()=>{
                this.openSnackBar('Friend request sent!','Close');
              }
          });
        }
      })
    }
    else if( name.length < 1)
      this.openSnackBar('Username is too short!','Close');
    else 
      this.openSnackBar('Already friends!','Close');
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  addName(name: string){
    this.names.push(name);
  }

  openDialog(index: number) {
    const dialogRef = this.dialog.open(FriendStatsComponent, {data: this.friends[index]});
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

}
