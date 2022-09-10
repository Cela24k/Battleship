import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css'],
  providers: [{
    provide: AuthService,
    useClass: AuthService
  },
  {
    provide: LocalStorageService,
    useClass: LocalStorageService
  }]
})
export class AccessComponent implements OnInit {
  errors = false;

  constructor(private auth: AuthService, private router: Router, private local: LocalStorageService, private sio: SocketioService) { }
  ngOnInit(): void { }

  onSubmit(username: string, password: string) {
    return this.auth.login(username, password).subscribe({
      next: (d: any) => {
        this.router.navigate(['/play']);
      },
      error: (err) => {//TODO vedere redirect per quando ci sono errori
        this.errors = true;
      },
      complete: ()=> console.log('Login completed'),
    });
  }

}
