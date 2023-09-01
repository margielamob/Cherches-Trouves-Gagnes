import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawCanvasComponent } from '@app/components/draw-canvas/draw-canvas.component';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { CreateGamePageComponent } from '@app/pages/create-game-page/create-game-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { GameSelectionPageComponent } from '@app/pages/game-selection-page/game-selection-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MongodbErrorPageComponent } from '@app/pages/mongodb-error-page/mongodb-error-page.component';
import { WaitingRoomComponent } from '@app/pages/waiting-room/waiting-room.component';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'create', component: CreateGamePageComponent },
    { path: 'select', component: GameSelectionPageComponent },
    { path: 'draw', component: DrawCanvasComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: 'waiting', component: WaitingRoomComponent },
    { path: 'error', component: MongodbErrorPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
