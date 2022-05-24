import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [{
    provide: AuthService,
    useClass: AuthService
  }]
})
export class RegisterComponent implements OnInit {

  register_error = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(username: string, email: string, password: string) {
    console.log('Submitting this info: ' + username + ' ' + email + ' ' + password);
    this.auth.register(username, email, password).subscribe({//right way for subscribing https://rxjs.dev/deprecations/subscribe-arguments
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);
        console.log('Login error: ' + JSON.stringify(err));
        this.register_error = true;
        console.log(this.register_error);
      },
      complete: () => console.log('Registration completed'),
    });
  }
}
