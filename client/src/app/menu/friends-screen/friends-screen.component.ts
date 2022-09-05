import { Component, OnInit } from '@angular/core';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private httpservice: UserHttpService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.httpservice.getFriends().subscribe({
      next: (data) => {
        console.log(data);
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
    console.log(name);

    if (!isFriend && name.length > 1) {
      // get user id from his Name
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
                console.log(data);
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
}
