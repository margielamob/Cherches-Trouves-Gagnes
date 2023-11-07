import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { RouterService } from '@app/services/router-service/router.service';
import { SocketEvent } from '@common/socket-event';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Socket } from 'socket.io-client';
import { ApprovalDialogComponent } from './approval-dialog.component';

/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('ApprovalDialogComponent', () => {
    let component: ApprovalDialogComponent;
    let fixture: ComponentFixture<ApprovalDialogComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let routerSpyObj: jasmine.SpyObj<RouterService>;
    let socketHelper: SocketTestHelper;
    let gameInformationHandlerService: jasmine.SpyObj<GameInformationHandlerService>;
    const model = {
        data: {
            opponentsName: 'name',
        },
    };

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        routerSpyObj = jasmine.createSpyObj('RouterService', ['navigateTo']);
        gameInformationHandlerService = jasmine.createSpyObj('GameInformationHandlerService', ['setPlayerName', 'getPlayer']);
        await TestBed.configureTestingModule({
            declarations: [ApprovalDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: model },
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: RouterService, useValue: routerSpyObj },
                { provide: GameInformationHandlerService, useValue: gameInformationHandlerService },
            ],
            imports: [
                RouterTestingModule,
                HttpClientModule,
                AppMaterialModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ApprovalDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should send no to the user', () => {
        const spySend = spyOn(component.socketService, 'send');
        component.onClickReject();
        expect(spySend).toHaveBeenCalled();
    });

    it('should send to server that the player accepted the request and start the game', () => {
        gameInformationHandlerService.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        const spySend = spyOn(component.socketService, 'send');
        component.onClickApprove();
        expect(spySend).toHaveBeenCalled();
        socketHelper.peerSideEmit(SocketEvent.Play);
        expect(routerSpyObj.navigateTo).toHaveBeenCalled();
        expect(gameInformationHandlerService.setPlayerName).toHaveBeenCalled();
    });

    it('should open snack bar when player left', () => {
        gameInformationHandlerService.getPlayer.and.callFake(() => {
            return { name: 'test', nbDifferences: 0 };
        });
        const spySnackBar = spyOn(component, 'openSnackBar').and.callFake(() => {});

        component.onClickApprove();
        socketHelper.peerSideEmit(SocketEvent.PlayerLeft);
        expect(spySnackBar).toHaveBeenCalled();
    });

    it('should open snackbar', () => {
        const spySnackBar = spyOn(component['snackBar'], 'openFromComponent').and.resolveTo();

        component.openSnackBar();
        expect(spySnackBar).toHaveBeenCalled();
    });
});
