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

  public errmessage = undefined;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(username: string, email: string, password: string) {
    console.log('Submitting this info: ' + username + ' ' + email + ' ' + password);
    this.auth.register(username, email, password).subscribe({//right way for subscribing https://rxjs.dev/deprecations/subscribe-arguments
      next: (d) => {// TODO error problem need to be checked
        console.log('Login granted: ' + JSON.stringify(d));
        this.errmessage = undefined;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);

        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = err.message;

      },
      complete: ()=> console.log('Registration completedf'),
    });
  }
}
