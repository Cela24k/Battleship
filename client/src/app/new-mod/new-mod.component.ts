import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-new-mod',
  templateUrl: './new-mod.component.html',
  styleUrls: ['./new-mod.component.css']
})
export class NewModComponent implements OnInit {
  register_error = false;

  constructor(private auth: AuthService, private router: Router, private ls: LocalStorageService) { }

  ngOnInit(): void {
    if(!this.auth.isLoggedIn()){
      this.router.navigate(['/login']);
    }
  }

  onSubmit(username: string, email: string, password: string) {
    this.auth.newMod(username, email, password).subscribe({//right way for subscribing https://rxjs.dev/deprecations/subscribe-arguments
      next: (d) => {
        this.auth.logOut();
        console.log('Login granted: ' + JSON.stringify(d));
      },
      error: (err) => {
        console.log(err);
        console.log('Login error: ' + JSON.stringify(err));
        this.register_error = true;
        console.log(this.register_error);
      },
      complete: () => {
        
        console.log('Modification completed')
      },
    });
  }
}
