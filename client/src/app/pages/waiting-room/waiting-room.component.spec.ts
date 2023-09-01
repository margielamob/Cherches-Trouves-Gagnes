import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from '@app/components/page-header/page-header.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
import { WaitingRoomComponent } from './waiting-room.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { Socket } from 'socket.io-client';
import { SocketEvent } from '@common/socket-event';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { PublicGameInformation } from '@common/game-information';

/* eslint-disable @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example) */
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyMatDialog: jasmine.SpyObj<MatDialog>;
    let spyGameInfoService: jasmine.SpyObj<GameInformationHandlerService>;

    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);
        spyMatDialog = jasmine.createSpyObj('MatDialog', ['open', 'closeAll']);
        spyGameInfoService = jasmine.createSpyObj('GameInformationHandlerService', [
            'getId',
            'setPlayerName',
            'getPlayer',
            'isClassic',
            'isLimitedTime',
        ]);

        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent, PageHeaderComponent, ExitGameButtonComponent],
            imports: [AppMaterialModule, RouterTestingModule, HttpClientModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: Router, useValue: spyRouter },
                { provide: MatDialog, useValue: spyMatDialog },
                { provide: GameInformationHandlerService, useValue: spyGameInfoService },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should redirect to select page when rejected', () => {
        spyGameInfoService.isClassic.and.callFake(() => true);
        socketHelper.peerSideEmit(SocketEvent.RejectPlayer);
        expect(spyRouter.navigate).toHaveBeenCalled();
    });

    it('should redirect to home page when rejected on temps limite', () => {
        spyGameInfoService.isLimitedTime.and.callFake(() => true);
        socketHelper.peerSideEmit(SocketEvent.RejectPlayer);
        expect(spyRouter.navigate).toHaveBeenCalled();
    });

    it('should send JoinGame when accepted', () => {
        spyGameInfoService.getPlayer.and.returnValue({ name: '', nbDifferences: 7 });
        const spySend = spyOn(component.socketService, 'send');
        socketHelper.peerSideEmit(SocketEvent.JoinGame, 'id');
        expect(spySend).toHaveBeenCalled();
        socketHelper.peerSideEmit(SocketEvent.Play);
    });

    it('should send JoinGame when accepted and navigate to game when game mode is Classic', () => {
        spyGameInfoService.getPlayer.and.returnValue({ name: '', nbDifferences: 7 });
        spyGameInfoService.isClassic.and.callFake(() => true);
        const spySend = spyOn(component.socketService, 'send');
        socketHelper.peerSideEmit(SocketEvent.JoinGame, 'id');
        socketHelper.peerSideEmit(SocketEvent.Play, 'id');
        expect(spySend).toHaveBeenCalled();
        expect(spyRouter.navigate).toHaveBeenCalled();
    });

    it('should open dialog to approve a player when a request is heard', () => {
        socketHelper.peerSideEmit(SocketEvent.RequestToJoin, 'name');
        expect(spyMatDialog.open).toHaveBeenCalled();
    });

    it('should send leaveWaiting on ng on destroy', () => {
        const spySend = spyOn(component.socketService, 'send');
        spyGameInfoService.roomId = 'room id';
        spyGameInfoService.gameInformation = {} as PublicGameInformation;
        component.ngOnDestroy();
        expect(spySend).toHaveBeenCalled();
    });

    it('should send leaveWaiting on ng on destroy', () => {
        const spySend = spyOn(component.socketService, 'send');
        spyGameInfoService.gameInformation = {} as PublicGameInformation;
        component.ngOnDestroy();
        expect(spySend).toHaveBeenCalled();
    });
});
