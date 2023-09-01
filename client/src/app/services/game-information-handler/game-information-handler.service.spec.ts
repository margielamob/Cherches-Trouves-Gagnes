import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { GameMode } from '@common/game-mode';
import { GameTimeConstants } from '@common/game-time-constants';
import { SocketEvent } from '@common/socket-event';
import { of } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameInformationHandlerService } from './game-information-handler.service';

/* eslint-disable @typescript-eslint/no-empty-function  -- connect needs to be empty (Nikolay's example)*/
class SocketClientServiceMock extends CommunicationSocketService {
    override connect() {}
}

describe('GameInformationHandlerService', () => {
    let service: GameInformationHandlerService;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;

    beforeEach(() => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['setGameTimeConstants', 'getGameTimeConstants']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientModule],
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                {
                    provide: Router,
                    useValue: spyRouter,
                },
                { provide: CommunicationService, useValue: spyCommunicationService },
            ],
        });

        service = TestBed.inject(GameInformationHandlerService);
        spyCommunicationService.getGameTimeConstants.and.callFake(() => {
            return of({ body: { gameTime: 2, penaltyTime: 2, successTime: 2 } } as HttpResponse<GameTimeConstants>);
        });
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return false when properties are not Undefined', () => {
        service.players = [{ name: 'test', nbDifferences: 0 }];
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
            isMulti: false,
        };
        service.gameMode = GameMode.Classic;
        spyRouter.navigate.and.returnValue(Promise.resolve(true));
        expect(service.propertiesAreUndefined()).toBeFalsy();
    });

    it('should handle socket', () => {
        service.handleSocketEvent();
        socketHelper.peerSideEmit(SocketEvent.Play, { gameId: 'id' });
        expect(service.roomId).toEqual('id');

        spyOn(service, 'setGameInformation').and.callFake(() => {});
        socketHelper.peerSideEmit(SocketEvent.Play, { gameId: 'id', gameCard: 'test' });
        expect(service.setGameInformation).toHaveBeenCalled();

        socketHelper.peerSideEmit(SocketEvent.WaitPlayer, 'id');
        expect(service.roomId).toEqual('id');
    });

    it('should return false when properties are not Undefined', () => {
        expect(service.propertiesAreUndefined()).toBeTruthy();
    });

    it('should return to homepage if properties are undefined', () => {
        service.handleNotDefined();
        expect(spyRouter.navigate).toHaveBeenCalled();
    });

    it('should set Player', () => {
        const expectedPlayer = { name: 'test', nbDifferences: 0 };
        service.setPlayerName(expectedPlayer.name);
        expect(service.players.find((player: { name: string; nbDifferences: number }) => player.name === expectedPlayer.name)).toEqual(
            expectedPlayer,
        );
    });

    it('should return nb of differences', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 10,
            isMulti: false,
        };
        expect(service.getNbTotalDifferences()).toEqual(service.gameInformation.nbDifferences);
    });

    it('should return id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
            isMulti: false,
        };
        expect(service.getId()).toEqual(service.gameInformation.id);
    });

    it('should return player one', () => {
        const spyHandleNotDefined = spyOn(service, 'handleNotDefined');
        service.players = [
            { name: 'player1', nbDifferences: 3 },
            { name: 'player2', nbDifferences: 1 },
        ];
        const response = service.getPlayer();
        expect(spyHandleNotDefined).toHaveBeenCalled();
        expect(response).toEqual({ name: 'player1', nbDifferences: 3 });
    });

    it('should return original bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
            isMulti: false,
        };
        expect(service.getOriginalBmpId()).toEqual('original');
    });

    it('should return modified bmp id', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
            isMulti: false,
        };
        expect(service.getModifiedBmpId()).toEqual('edited');
    });

    it('should set game information', () => {
        const gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            differenceRadius: 2,
            differences: [],
            nbDifferences: 0,
            isMulti: false,
        };
        service.setGameInformation(gameInformation);
        expect(service.gameInformation).toEqual(gameInformation);
    });

    it('should set game mode', () => {
        service.setGameMode(GameMode.Classic);
        expect(service.gameMode).toEqual(GameMode.Classic);
    });

    it('should get game mode', () => {
        service.gameMode = GameMode.Classic;
        expect(service.getGameMode()).toEqual(GameMode.Classic);
    });

    it('should get game name', () => {
        service.gameInformation = {
            id: '1',
            name: 'test',
            thumbnail: 'image',
            idOriginalBmp: 'original',
            idEditedBmp: 'edited',
            soloScore: [],
            multiplayerScore: [],
            nbDifferences: 0,
            isMulti: false,
        };
        expect(service.getGameName()).toEqual('test');
    });

    it('reset player', () => {
        service.resetPlayers();
        expect(service.players).toEqual([]);
    });

    it('should get the nb of difference', () => {
        service.players = [{ name: 'test', nbDifferences: 0 }];
        expect(service.getNbDifferences('test')).toEqual(0);
        expect(service.getNbDifferences('playerNotFound')).toEqual(undefined);
    });

    it('should get the opponent information', () => {
        const expectedPlayers = [
            { name: 'mainPlayer', nbDifferences: 0 },
            { name: 'opponentPlayer', nbDifferences: 0 },
        ];
        service.players = expectedPlayers;
        expect(service.getOpponent()).toEqual(expectedPlayers[1]);
    });

    it('should return true is is classic', () => {
        service.gameMode = GameMode.Classic;
        expect(service.isClassic()).toBeTrue();
    });

    it('should return true is is temps limite', () => {
        service.gameMode = GameMode.LimitedTime;
        expect(service.isLimitedTime()).toBeTrue();
    });

    it('should get the game time constants', () => {
        service.getConstants();
        const expectedGameTime = 2;
        const expectedPenaltyTime = 2;
        const expectedSuccessTime = 2;
        expect(service.gameTimeConstants.gameTime).toBe(expectedGameTime);
        expect(service.gameTimeConstants.penaltyTime).toBe(expectedPenaltyTime);
        expect(service.gameTimeConstants.successTime).toBe(expectedSuccessTime);
    });
});
