import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccessComponent } from './access/access.component';
import { PlayGameComponent } from './play-game/play-game.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth.service';
import { NotificationListenerService } from './notification-listener.service';
import { SocketioService } from './socketio.service';
import { LocalStorageService } from './local-storage.service';
import { PlayGamePanelComponent } from './play-game/play-game-panel/play-game-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NotificationComponent } from './notification/notification.component';
import { MatBadgeModule } from '@angular/material/badge';
import { HttpTokenPortingService } from './http-token-porting.service';
import { ProfileBannerComponent } from './notification/profile-banner/profile-banner.component';
import { MenuComponent } from './menu/menu.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';  
import { ChatComponent } from './chat/chat.component';
import { ChatPrevComponent } from './chat/chat-prev/chat-prev.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; //vedere se importare solo le singole componenti
import { ChatWindowComponent } from './chat/chat-window/chat-window.component'; 

@NgModule({
  declarations: [
    AppComponent,
    AccessComponent,
    PlayGameComponent,
    RegisterComponent,
    PlayGamePanelComponent,
    NotificationComponent,
    ProfileBannerComponent,
    MenuComponent,
    ChatComponent,
    ChatPrevComponent,
    ChatWindowComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    CommonModule,
    NgbModule //anche qui
  ],
  providers: [
              { provide: HTTP_INTERCEPTORS, useClass: HttpTokenPortingService, multi:true},
              { provide: AuthService, useClass: AuthService },
              { provide: LocalStorageService, useClass: LocalStorageService },
              { provide: SocketioService, useClass: SocketioService },
              { provide: NotificationListenerService, useClass: NotificationListenerService }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
