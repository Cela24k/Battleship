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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MessageBubbleComponent } from './chat/chat-window/message-bubble/message-bubble.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { PlayGameRandomComponent } from './play-game/play-game-random/play-game-random.component';
import { MatButtonModule } from '@angular/material/button';
import { MenuSearchboxComponent } from './menu/menu-searchbox/menu-searchbox.component';
import { MatDialogModule } from '@angular/material/dialog'; //used in menu 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { FieldComponent } from './play-game/field/field.component';
import { ShotsComponent } from './play-game/shots/shots.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileScreenComponent } from './menu/profile-screen/profile-screen.component';
import { FriendsScreenComponent } from './menu/friends-screen/friends-screen.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { FriendsScreenPrevComponent } from './menu/friends-screen/friends-screen-prev/friends-screen-prev.component';
import { TileComponent } from './play-game/tile/tile.component';
import { MatchmakingComponent } from './play-game/matchmaking/matchmaking.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChooseFriendComponent } from './play-game/choose-friend/choose-friend.component';
import { PlaySearchboxComponent } from './play-game/choose-friend/play-searchbox/play-searchbox.component';
import { WaitingFriendComponent } from './play-game/waiting-friend/waiting-friend.component';
import { NewModComponent } from './new-mod/new-mod.component'
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FriendStatsComponent } from './menu/friends-screen/friends-screen-prev/friend-stats/friend-stats.component';
import { SpectateComponent } from './play-game/spectate/spectate.component'

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
    MessageBubbleComponent,
    PlayGameRandomComponent,
    MenuSearchboxComponent,
    FieldComponent,
    ShotsComponent,
    ProfileScreenComponent,
    FriendsScreenComponent,
    FriendsScreenPrevComponent,
    TileComponent,
    MatchmakingComponent,
    ChooseFriendComponent,
    PlaySearchboxComponent,
    WaitingFriendComponent,
    FriendStatsComponent,
    NewModComponent,

    SpectateComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatChipsModule,
    MatGridListModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ScrollingModule,

    FormsModule,
    BrowserAnimationsModule,
    CommonModule,
    NgbModule, //anche qui
    DragDropModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenPortingService, multi: true },
    { provide: LocalStorageService, useClass: LocalStorageService },
    { provide: AuthService, useClass: AuthService },
    { provide: SocketioService, useClass: SocketioService },
    { provide: NotificationListenerService, useClass: NotificationListenerService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
