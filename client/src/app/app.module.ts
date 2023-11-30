import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolBoxComponent } from '@app/components/tool-box/tool-box.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { AppComponent } from '@app/pages/app/app.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { NgxElectronModule } from 'ngx-electron';
import { ImageCropperModule } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { AdminCommandsComponent } from './components/admin-commands/admin-commands.component';
import { AppLogoComponent } from './components/app-logo/app-logo.component';
import { ApprovalDialogComponent } from './components/approval-dialog/approval-dialog.component';
import { CentralBoxComponent } from './components/central-tool-box/central-tool-box.component';
import { ChatBoxComponent } from './components/chat-box/chat-box.component';
import { ChatFeedDetachedComponent } from './components/chat-panel-detached/chat-feed/chat-feed.component';
import { ChatListDetachedComponent } from './components/chat-panel-detached/chat-list/chat-list.component';
import { ChatOverlayDetachedComponent } from './components/chat-panel-detached/chat-overlay/chat-overlay.component';
import { ChatPanelDetachedComponent } from './components/chat-panel-detached/chat-panel/chat-panel.component';
import { RoomAddDetachedComponent } from './components/chat-panel-detached/room-add/room-add.component';
import { RoomCardDetachedComponent } from './components/chat-panel-detached/room-card/room-card.component';
import { RoomCreateDetachedComponent } from './components/chat-panel-detached/room-create/room-create.component';
import { RoomSearchDetachedComponent } from './components/chat-panel-detached/room-search/room-search.component';
import { ChatButtonComponent } from './components/chat-panel/chat-button/chat-button.component';
import { ChatFeedComponent } from './components/chat-panel/chat-feed/chat-feed.component';
import { ChatListComponent } from './components/chat-panel/chat-list/chat-list.component';
import { ChatOverlayComponent } from './components/chat-panel/chat-overlay/chat-overlay.component';
import { ChatPanelComponent } from './components/chat-panel/chat-panel/chat-panel.component';
import { RoomAddComponent } from './components/chat-panel/room-add/room-add.component';
import { RoomCardComponent } from './components/chat-panel/room-card/room-card.component';
import { RoomCreateComponent } from './components/chat-panel/room-create/room-create.component';
import { RoomSearchComponent } from './components/chat-panel/room-search/room-search.component';
import { CluesAreaComponent } from './components/clues-area/clues-area.component';
import { CommonToolBoxComponent } from './components/common-tool-box/common-tool-box.component';
import { ConfirmDeleteDialogComponent } from './components/confirm-delete-dialog/confirm-delete-dialog.component';
import { CreateJoinGameDialogueComponent } from './components/create-join-game-dialogue/create-join-game-dialogue.component';
import { CropperDialogComponent } from './components/cropper-dialog/cropper-dialog.component';
import { DialogChangeNameComponent } from './components/dialog-change-name/dialog-change-name.component';
import { DialogConfirmResetPasswordComponent } from './components/dialog-confirm-reset-password/dialog-confirm-reset-password.component';
import { DialogCreateGameComponent } from './components/dialog-create-game/dialog-create-game.component';
import { DialogDeleteAccountComponent } from './components/dialog-delete-account/dialog-delete-account.component';
import { DialogGameOverComponent } from './components/dialog-game-over/dialog-game-over.component';
import { DialogLimitedTimeComponent } from './components/dialog-limited-time/dialog-limited-time.component';
import { DialogSetUpGameComponent } from './components/dialog-set-up-game/dialog-set-up-game/dialog-set-up-game.component';
import { DialogUploadFormComponent } from './components/dialog-upload-form/dialog-upload-form.component';
import { DialogUserAvatarComponent } from './components/dialog-user-avatar/dialog-user-avatar.component';
import { DifferencesAreaComponent } from './components/differences-area/differences-area.component';
import { ExitGameButtonComponent } from './components/exit-game-button/exit-game-button.component';
import { FriendRequestsComponent } from './components/friend-requests/friend-requests.component';
import { FriendsListComponent } from './components/friends-list/friends-list.component';
import { GameCardButtonsComponent } from './components/game-card-buttons/game-card-buttons.component';
import { GameCardComponent } from './components/game-card/game-card.component';
import { GameCarouselComponent } from './components/game-carousel/game-carousel.component';
import { GameConstantFieldComponent } from './components/game-constant-field/game-constant-field.component';
import { GameConstantsSettingsComponent } from './components/game-constants-settings/game-constants-settings.component';
import { GameScoreComponent } from './components/game-score/game-score.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';
import { NoGameSnackbarComponent } from './components/no-game-snackbar/no-game-snackbar.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { PlayerLeftSnackbarComponent } from './components/player-left-snackbar/player-left-snackbar.component';
import { RectangleOutlineComponent } from './components/rectangle-outline/rectangle-outline.component';
import { RefreshSnackbarComponent } from './components/refresh-snackbar/refresh-snackbar.component';
import { RejectedDialogComponent } from './components/rejected-dialog/rejected-dialog.component';
import { ReplayBarComponent } from './components/replay-bar/replay-bar.component';
import { SearchBatComponent } from './components/search-bat/search-bat.component';
import { TimerStopwatchComponent } from './components/timer-stopwatch/timer-stopwatch.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { UserNameInputComponent } from './components/user-name-input/user-name-input.component';
import { UserProfilInformationComponent } from './components/user-profil-information/user-profil-information.component';
import { UserStatisticComponent } from './components/user-statistic/user-statistic.component';
import { EmailVerificationComponent } from './pages/email-verification/email-verification.component';
import { FriendsPageComponent } from './pages/friends-page/friends-page.component';
import { GameSelectionPageComponent } from './pages/game-selection-page/game-selection-page.component';
import { JoinGameSelectionComponent } from './pages/join-game-selection/join-game-selection.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { MongodbErrorPageComponent } from './pages/mongodb-error-page/mongodb-error-page.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SignUpPageComponent } from './pages/sign-up-page/sign-up-page.component';
import { WaitingRoomComponent } from './pages/waiting-room/waiting-room.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        CreateGamePageComponent,
        DrawCanvasComponent,
        ToolBoxComponent,
        DialogFormsErrorComponent,
        GameSelectionPageComponent,
        AdminPageComponent,
        DialogUploadFormComponent,
        GameCardComponent,
        GameConstantsSettingsComponent,
        UserNameInputComponent,
        GameCarouselComponent,
        AdminCommandsComponent,
        CluesAreaComponent,
        PlayAreaComponent,
        ExitGameButtonComponent,
        TimerStopwatchComponent,
        DifferencesAreaComponent,
        DialogCreateGameComponent,
        GameConstantFieldComponent,
        GameCardButtonsComponent,
        GameScoreComponent,
        PageHeaderComponent,
        LoadingScreenComponent,
        DialogGameOverComponent,
        WaitingRoomComponent,
        ChatBoxComponent,
        ApprovalDialogComponent,
        CommonToolBoxComponent,
        PlayerLeftSnackbarComponent,
        RejectedDialogComponent,
        RefreshSnackbarComponent,
        DialogLimitedTimeComponent,
        MongodbErrorPageComponent,
        CentralBoxComponent,
        NoGameSnackbarComponent,
        ConfirmDeleteDialogComponent,
        LoginPageComponent,
        SignUpPageComponent,
        AppLogoComponent,
        ChatPanelComponent,
        ChatListComponent,
        ChatFeedComponent,
        RoomSearchComponent,
        RoomCreateComponent,
        RoomAddComponent,
        SettingsPageComponent,
        UserProfilInformationComponent,
        DialogUserAvatarComponent,
        UserStatisticComponent,
        UserAvatarComponent,
        EmailVerificationComponent,
        DialogDeleteAccountComponent,
        ChatOverlayComponent,
        ChatButtonComponent,
        RoomCardComponent,
        JoinGameSelectionComponent,
        DialogSetUpGameComponent,
        DialogChangeNameComponent,
        DialogConfirmResetPasswordComponent,
        ResetPasswordComponent,
        CreateJoinGameDialogueComponent,
        ReplayBarComponent,
        SearchBatComponent,
        FriendRequestsComponent,
        FriendsListComponent,
        FriendsPageComponent,
        CropperDialogComponent,
        ChatFeedDetachedComponent,
        ChatListDetachedComponent,
        ChatPanelDetachedComponent,
        RoomAddDetachedComponent,
        RoomCardDetachedComponent,
        RoomCreateDetachedComponent,
        RoomSearchDetachedComponent,
        ChatOverlayDetachedComponent,
        RectangleOutlineComponent,
    ],
    imports: [
        ImageCropperModule,
        MatCheckboxModule,
        AppMaterialModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        BrowserModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        HttpClientModule,
        // NgxElectronModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

// ngx-translate and the loader module documentation : http://www.ngx-translate.com/
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, @typescript-eslint/naming-convention
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
