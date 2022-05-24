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
  
  
  ngOnInit(): void {
  }

  onSubmit(username:string, password: string){

    
    return this.auth.login(username, password).subscribe({
      next: (d) => {
        console.log('Login granted: ' + JSON.stringify(d));

        this.router.navigate(['/play']);
      },
      error: (err) => {//TODO vedere redirect per quando ci sono errori
        console.log(err);
      },
      complete: ()=> console.log('Login completed'),
    });
  }

}
