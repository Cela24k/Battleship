import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(username: string, email: string, password: string){
    console.log('Submitting this info: ' + username +' '+ email +''+password);
    this.auth.register(username,email,password);
  }
}
