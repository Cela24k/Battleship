import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
  route = '';

  constructor(private auth: AuthService, private router: Router, private local: LocalStorageService, private sio: SocketioService, route:ActivatedRoute) {
    route.params.subscribe(val => {

      this.router.events.subscribe((event) => {
        event instanceof NavigationEnd ? this.route = this.router.url : null;
        console.log(this.route);
      })

    });
  }

  ngOnInit(): void { 
    if(this.route === '/login' && this.local.getToken() != null){
      this.router.navigate(['/play'])
    }

  }

  ngOnUpdate(){
    console.log('update');
    // if(this.route === '/login' && (this.local.getToken() || this.local.getToken() != ''))
    //   this.router.navigate(['/play'])
  }

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
