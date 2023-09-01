import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { PlayerLeftSnackbarComponent } from './player-left-snackbar.component';

describe('PlayerLeftSnackbarComponent', () => {
    let component: PlayerLeftSnackbarComponent;
    let fixture: ComponentFixture<PlayerLeftSnackbarComponent>;
    let spyGameInfoService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        spyGameInfoService = jasmine.createSpyObj('GameInformationHandlerService', ['gameMode', 'isLimitedTime']);

        await TestBed.configureTestingModule({
            declarations: [PlayerLeftSnackbarComponent],
            imports: [MatDialogModule, AppMaterialModule, RouterTestingModule, HttpClientModule],
            providers: [
                { provide: MatSnackBarRef, useValue: {} },
                { provide: MAT_SNACK_BAR_DATA, useValue: {} },
                { provide: GameInformationHandlerService, useValue: spyGameInfoService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlayerLeftSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return correct message', () => {
        spyGameInfoService.isLimitedTime.and.callFake(() => false);
        expect(component.messageSnackBar()).toEqual('Le joueur a quitté la partie.');
        spyGameInfoService.isLimitedTime.and.callFake(() => true);
        expect(component.messageSnackBar()).toEqual('Le joueur a quitté la partie. Vous jouez maintenant en solo.');
    });
});
