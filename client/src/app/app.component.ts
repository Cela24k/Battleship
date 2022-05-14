import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';
  logged = 1; // 1 this is going to change dynamically with cookies, 1 shows "login" page, 2 shows "register" and 3 shows "play a game"
  
  ngOnInit(): void {
    console.log(this.logged);

  }

  navigateRegister(): void{
    this.logged = 2;
    console.log(this.logged);

  }
}
