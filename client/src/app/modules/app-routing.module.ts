import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { AuthGuard } from '@app/guards/auth.guard';
import { RedirectIfAuthenticatedGuard } from '@app/guards/redirect.guard';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameSelectionPageComponent } from '@app/pages/game-selection-page/game-selection-page.component';
import { LoginPageComponent } from '@app/pages/login-page/login-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MongodbErrorPageComponent } from '@app/pages/mongodb-error-page/mongodb-error-page.component';
import { SignUpPageComponent } from '@app/pages/sign-up-page/sign-up-page.component';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginPageComponent, canActivate: [RedirectIfAuthenticatedGuard] },
    { path: 'sign-up', component: SignUpPageComponent, canActivate: [RedirectIfAuthenticatedGuard] },
    { path: 'home', component: MainPageComponent, canActivate: [AuthGuard] },
    { path: 'game', component: GamePageComponent, canActivate: [AuthGuard] },
    { path: 'create', component: CreateGamePageComponent, canActivate: [AuthGuard] },
    { path: 'select', component: GameSelectionPageComponent, canActivate: [AuthGuard] },
    { path: 'draw', component: DrawCanvasComponent, canActivate: [AuthGuard] },
    { path: 'admin', component: AdminPageComponent, canActivate: [AuthGuard] },
    { path: 'waiting', component: WaitingRoomComponent, canActivate: [AuthGuard] },
    { path: 'error', component: MongodbErrorPageComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
