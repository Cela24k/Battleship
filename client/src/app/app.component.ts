import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';
  logged = 3; // 1 this is going to change dynamically with cookies and authentication, 1 shows "login" page, 2 shows "register" and 3 shows "play a game"
  
  ngOnInit(): void {

  }

  navigateRegister(): void{
    this.logged = 2;
  }
}
