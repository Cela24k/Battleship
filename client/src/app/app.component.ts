import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
//import UserHttpService 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'client';

  button = "register";

  logged = 1; // 1 this is going to change dynamically with cookies and authentication, 1 shows "login" page, 2 shows "register" and 3 shows "play a game"
  
  constructor( /*private us: UserHttpService, */ private router: Router  ) { }

  ngOnInit(): void {
  }

  navigateRegister(): void{
    this.router.navigate(['/register']);
    this.button = "login";

  }

  navigateLogin(): void{
    this.router.navigate(['/login']);
    this.button = "register";

  }
}
