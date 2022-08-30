import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserHttpService, UserInterface } from 'src/app/user-http.service';
import { MatTableDataSource } from '@angular/material/table';
import { LocalStorageService } from 'src/app/local-storage.service';
import { ChatInterface, emptyChat } from 'src/app/chat/chat.component';

@Component({
  selector: 'app-menu-searchbox',
  templateUrl: './menu-searchbox.component.html',
  styleUrls: ['./menu-searchbox.component.css']
})
export class MenuSearchboxComponent implements OnInit {
  @Output() openChatEvent = new EventEmitter<ChatInterface>();
  @Input() type: string = '';

  displayedColumns: string[] = ['username', 'elo', 'playing'];
  friendlist: UserInterface[] = [];
  dataSource = new MatTableDataSource(this.friendlist);
  clickedElements: UserInterface[] = [];
  constructor(private httpClient: UserHttpService, private localstorage: LocalStorageService ) { }

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
    if (this.localstorage.getRole() != 0) {
      let friends: string[];

      this.httpClient.getFriends().subscribe({
        next: (data) => {
          friends = data;
          this.friendlist = this.friendlist.filter((e) => {
            return friends.includes(e._id);
          })
          this.dataSource = new MatTableDataSource(this.friendlist);
        },
        error: (e) => {
          console.log(e);
        }
      })
    }
    else {
      this.dataSource = new MatTableDataSource(this.friendlist);
    }
  }

  //filtrare per lutente normale gli utenti non amici 
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  newChat(data: any) {
    console.log(data)
    const chat = emptyChat();
    this.openChatEvent.emit(chat);
  }

  clickElement(row: any){
    const index = this.clickedElements.indexOf(row)
    if(index!=-1)
      this.clickedElements.splice(index,1);
    else 
      this.clickedElements.push(row);
  }
}
