import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  constructor(private auth: AuthService, private router: Router, private local: LocalStorageService) { }
  
  public errmessage = undefined;//avoidare questo TODO vedere come ritornare bene gli errori
  ngOnInit(): void {
  }

  onSubmit(username:string, password: string){

    
    return this.auth.login(username, password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));
        this.errmessage = undefined;

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.log(err);

        console.log('Login error: ' + JSON.stringify(err));
        this.errmessage = err.message;

      },
      complete: ()=> console.log('Registration completed'),
    });
  }

}
