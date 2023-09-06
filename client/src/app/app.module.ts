import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogFormsErrorComponent } from "@app/components/dialog-forms-error/dialog-forms-error.component";
import { DrawCanvasComponent } from "@app/components/draw-canvas/draw-canvas.component";
import { PlayAreaComponent } from "@app/components/play-area/play-area.component";
import { SidebarComponent } from "@app/components/sidebar/sidebar.component";
import { ToolBoxComponent } from "@app/components/tool-box/tool-box.component";
import { AppRoutingModule } from "@app/modules/app-routing.module";
import { AppMaterialModule } from "@app/modules/material.module";
import { AdminPageComponent } from "@app/pages/admin-page/admin-page.component";
import { AppComponent } from "@app/pages/app/app.component";
import { CreateGamePageComponent } from "@app/pages/create-game-page/create-game-page.component";
import { GamePageComponent } from "@app/pages/game-page/game-page.component";
import { MainPageComponent } from "@app/pages/main-page/main-page.component";
import { AdminCommandsComponent } from "./components/admin-commands/admin-commands.component";
import { ApprovalDialogComponent } from "./components/approval-dialog/approval-dialog.component";
import { CentralBoxComponent } from "./components/central-tool-box/central-tool-box.component";
import { ChatBoxComponent } from "./components/chat-box/chat-box.component";
import { CluesAreaComponent } from "./components/clues-area/clues-area.component";
import { CommonToolBoxComponent } from "./components/common-tool-box/common-tool-box.component";
import { DialogCreateGameComponent } from "./components/dialog-create-game/dialog-create-game.component";
import { DialogGameOverComponent } from "./components/dialog-game-over/dialog-game-over.component";
import { DialogLimitedTimeComponent } from "./components/dialog-limited-time/dialog-limited-time.component";
import { DialogUploadFormComponent } from "./components/dialog-upload-form/dialog-upload-form.component";
import { DifferencesAreaComponent } from "./components/differences-area/differences-area.component";
import { ExitGameButtonComponent } from "./components/exit-game-button/exit-game-button.component";
import { GameCardButtonsComponent } from "./components/game-card-buttons/game-card-buttons.component";
import { GameCardComponent } from "./components/game-card/game-card.component";
import { GameCarouselComponent } from "./components/game-carousel/game-carousel.component";
import { GameConstantFieldComponent } from "./components/game-constant-field/game-constant-field.component";
import { GameConstantsSettingsComponent } from "./components/game-constants-settings/game-constants-settings.component";
import { GameScoreComponent } from "./components/game-score/game-score.component";
import { LoadingScreenComponent } from "./components/loading-screen/loading-screen.component";
import { PageHeaderComponent } from "./components/page-header/page-header.component";
import { PlayerLeftSnackbarComponent } from "./components/player-left-snackbar/player-left-snackbar.component";
import { RefreshSnackbarComponent } from "./components/refresh-snackbar/refresh-snackbar.component";
import { RejectedDialogComponent } from "./components/rejected-dialog/rejected-dialog.component";
import { TimerStopwatchComponent } from "./components/timer-stopwatch/timer-stopwatch.component";
import { UserNameInputComponent } from "./components/user-name-input/user-name-input.component";
import { GameSelectionPageComponent } from "./pages/game-selection-page/game-selection-page.component";
import { WaitingRoomComponent } from "./pages/waiting-room/waiting-room.component";
import { MongodbErrorPageComponent } from "./pages/mongodb-error-page/mongodb-error-page.component";
import { NoGameSnackbarComponent } from "./components/no-game-snackbar/no-game-snackbar.component";
import { ConfirmDeleteDialogComponent } from "./components/confirm-delete-dialog/confirm-delete-dialog.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database"; // Importez ce module
import { AngularFireStorageModule } from "@angular/fire/compat/storage"; // Importez ce module
import { SignUpPageComponent } from "./pages/sign-up-page/sign-up-page.component";

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
  ],
  imports: [
    AppMaterialModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
