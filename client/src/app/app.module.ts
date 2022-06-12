import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessComponent } from './access/access.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './auth.service';
import { NotificationListenerService } from './notification-listener.service';

@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    PlayGameComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: AuthService, useClass: AuthService },
              { provide: NotificationListenerService, useClass: NotificationListenerService }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
