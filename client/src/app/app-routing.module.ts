import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessComponent } from './access/access.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { RegisterComponent } from './register/register.component';

const authed = true; //reperire la info dal jwt

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: AccessComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'play', component: PlayGameComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})


export class AppRoutingModule { }
