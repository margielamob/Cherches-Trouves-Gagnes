import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminCommandsComponent } from '@app/components/admin-commands/admin-commands.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserNameInputComponent } from './user-name-input.component';

describe('UserNameInputComponent', () => {
    let component: UserNameInputComponent;
    let fixture: ComponentFixture<UserNameInputComponent>;
    let spySocketCommunication: jasmine.SpyObj<CommunicationSocketService>;
    let spyGameInformationService: jasmine.SpyObj<GameInformationHandlerService>;
    const model = { isMulti: false };
    const dialogMock = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- close for test empty function
        close: () => {},
    };

    beforeEach(async () => {
        spySocketCommunication = jasmine.createSpyObj('CommunicationSocketService', ['send']);
        spyGameInformationService = jasmine.createSpyObj('GameInformationHandlerService', [
            'setPlayerName',
            'getId',
            'handleSocketEvent',
            'resetPlayers',
            'isLimitedTime',
            'getConstants',
        ]);
        await TestBed.configureTestingModule({
            declarations: [UserNameInputComponent, AdminCommandsComponent],
            imports: [
                AppMaterialModule,
                NoopAnimationsModule,
                FormsModule,
                RouterTestingModule,
                ReactiveFormsModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                {
                    provide: MatDialogRef,
                    useValue: dialogMock,
                },
                { provide: MAT_DIALOG_DATA, useValue: model },
                {
                    provide: GameInformationHandlerService,
                    useValue: spyGameInformationService,
                },
                {
                    provide: CommunicationSocketService,
                    useValue: spySocketCommunication,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(UserNameInputComponent);
        component = fixture.componentInstance;
        component.form.controls.name.setValue('test');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should verify if name is valid', () => {
        component['playerName'] = 'test';
        expect(component.isValidName()).toBeTrue();

        component['playerName'] = '  ';
        expect(component.isValidName()).toBeFalse();

        component['playerName'] = '';
        expect(component.isValidName()).toBeFalse();
    });

    it('should use socket communication when click and is not multi', () => {
        component['playerName'] = 'test';
        component.onClickContinue();
        expect(spySocketCommunication.send).toHaveBeenCalled();
        expect(spyGameInformationService.setPlayerName).toHaveBeenCalled();
    });

    it('should use socket communication when click and is multi', () => {
        component['playerName'] = 'test';
        component['isMulti'] = true;
        component.onClickContinue();
        expect(spySocketCommunication.send).toHaveBeenCalled();
        expect(spyGameInformationService.setPlayerName).toHaveBeenCalled();
    });

    it('should open dialog when GameMode is Limited Time', () => {
        spyGameInformationService.isLimitedTime.and.callFake(() => true);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyDialog = spyOn(component, 'openGameModeDialog').and.callFake(() => {});
        component['playerName'] = 'test';
        component.onClickContinue();
        expect(spyDialog).toHaveBeenCalled();
    });

    it('should open dialog dialog on openGameModeDialog', () => {
        const spyDialog = spyOn(component['matDialog'], 'open');
        component.openGameModeDialog();
        expect(spyDialog).toHaveBeenCalled();
    });

    it('should send information when the button is clicked', () => {
        component.onClickContinue();
        component['playerName'] = 'test';
        expect(spyGameInformationService.setPlayerName).toHaveBeenCalledWith('test');
    });
});
