import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from 'src/app/local-storage.service';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';

@Component({
  selector: 'app-play-searchbox',
  templateUrl: './play-searchbox.component.html',
  styleUrls: ['./play-searchbox.component.css']
})
export class PlaySearchboxComponent implements OnInit {

  displayedColumns: string[] = ['username', 'elo', 'playing'];
  friendlist: UserInterface[] = [];
  dataSource = new MatTableDataSource(this.friendlist);
  clickedElements: UserInterface[] = [];

  constructor(private httpClient: UserHttpService, private localstorage: LocalStorageService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.httpClient.getUsers().subscribe({
      next: (data) => {
        this.friendlist = data;
        this.filterList();
      },
      error: (e) => {
        console.log(e);
      },
    })
  }

  filterList(): void {

    let friends: string[];

    this.httpClient.getFriends().subscribe({
      next: (data) => {
        friends = data;
        this.friendlist = this.friendlist.filter((e) => {
          if (this.localstorage.getRole() != 0) 
            return friends.includes(e._id) && e.state == 'Online';
          else 
            return e.state == 'Online';
        })
        this.dataSource = new MatTableDataSource(this.friendlist);
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clickElement(row: any) {
    const index = this.clickedElements.indexOf(row)
    if (index != -1)
      this.clickedElements.splice(index, 1);
    else {
      this.clickedElements.pop();
      this.clickedElements.push(row);
    }
  }
}
