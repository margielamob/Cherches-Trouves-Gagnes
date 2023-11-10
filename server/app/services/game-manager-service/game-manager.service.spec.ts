/* eslint-disable max-lines */
import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { BmpDifferenceInterpreter } from '@app/services/bmp-difference-interpreter-service/bmp-difference-interpreter.service';
import { BmpService } from '@app/services/bmp-service/bmp.service';
import { BmpSubtractorService } from '@app/services/bmp-subtractor-service/bmp-subtractor.service';
import { DatabaseService } from '@app/services/database-service/database.service';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { GameInfoService } from '@app/services/game-info-service/game-info.service';
import { GameManagerService } from '@app/services/game-manager-service/game-manager.service';
import { IdGeneratorService } from '@app/services/id-generator-service/id-generator.service';
import { ImageRepositoryService } from '@app/services/image-repository/image-repository.service';
import { LimitedTimeGame } from '@app/services/limited-time-game-service/limited-time-game.service';
import { LoggerService } from '@app/services/logger-service/logger.service';
import { TimerService } from '@app/services/timer-service/timer.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { restore, SinonSpiedInstance, stub, useFakeTimers } from 'sinon';
import { Server } from 'socket.io';
import { Container } from 'typedi';

describe('GameManagerService', () => {
    let clock: sinon.SinonFakeTimers;
    let bmpService: BmpService;
    let bmpSubtractorService: BmpSubtractorService;
    let bmpDifferenceService: BmpDifferenceInterpreter;
    let gameManager: GameManagerService;
    let gameInfoSpyObj: SinonSpiedInstance<GameInfoService>;
    let idGeneratorService: sinon.SinonStubbedInstance<IdGeneratorService>;
    let limitedTimeService: LimitedTimeGame;
    let difference: DifferenceService;
    let timer: TimerService;
    let imageRepositoryService: ImageRepositoryService;
    let logger: LoggerService;

    beforeEach(() => {
        clock = useFakeTimers();
        bmpService = Container.get(BmpService);
        timer = Container.get(TimerService);
        bmpSubtractorService = Container.get(BmpSubtractorService);
        bmpDifferenceService = Container.get(BmpDifferenceInterpreter);
        idGeneratorService = sinon.createStubInstance(IdGeneratorService);
        imageRepositoryService = Container.get(ImageRepositoryService);
        logger = Container.get(LoggerService);
        idGeneratorService['generateNewId'].callsFake(() => {
            return '5';
        });
        const gameInfo = new GameInfoService(
            {} as DatabaseService,
            bmpService,
            bmpSubtractorService,
            bmpDifferenceService,
            imageRepositoryService,
            logger,
        );
        difference = new DifferenceService();
        limitedTimeService = new LimitedTimeGame(gameInfo);
        gameInfoSpyObj = stub(gameInfo);
        gameManager = new GameManagerService(gameInfo, limitedTimeService, difference, timer);
    });

    afterEach(() => {
        clock.restore();
        restore();
    });

    it('should create a game mode Classic', async () => {
        expect(await gameManager.createGame({ player: { name: 'test', id: '' }, isMulti: false }, GameMode.Classic, '')).to.equal(
            Array.from(gameManager['games'].values())[0].identifier,
        );
        expect(gameInfoSpyObj.getGameInfoById.called).to.equal(true);
        expect(gameManager['games'].size).not.to.equal(0);
    });

    it('should create a game mode Limited', async () => {
        const spyLimitedTime = stub(limitedTimeService, 'generateGames')
            .resolves()
            .returns({} as Promise<PrivateGameInformation[]>);
        expect(await gameManager.createGame({ player: { name: 'test', id: '' }, isMulti: false }, GameMode.LimitedTime, '')).to.equal(
            Array.from(gameManager['games'].values())[0].identifier,
        );
        expect(spyLimitedTime.called).to.equal(true);
        expect(gameManager['games'].size).not.to.equal(0);
    });

    it('should return if is classic', () => {
        expect(gameManager.isClassic('1')).to.equal(null);
        const expectedGame = stub(
            new Game(
                { player: { name: 'test', id: '' }, isMulti: false },
                { info: { id: '3' } as PrivateGameInformation, mode: GameMode.LimitedTime },
            ),
        );
        expectedGame.isClassic.callsFake(() => true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        expect(gameManager.isClassic('3')).to.deep.equal(true);
    });

    it('should return if is limited time', () => {
        expect(gameManager.isLimitedTime('1')).to.equal(null);

        const expectedGame = stub(
            new Game(
                { player: { name: 'test', id: '' }, isMulti: false },
                { info: { id: '4' } as PrivateGameInformation, mode: GameMode.LimitedTime },
            ),
        );
        expectedGame.isLimitedTime.callsFake(() => true);

        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        expect(gameManager.isLimitedTime('4')).to.equal(true);
    });

    it('should check if the game is found', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => {
            return {} as Game;
        });
        expect(gameManager.isGameFound('')).to.equal(true);
        expect(findGameSpy.called).to.equal(true);

        findGameSpy.callsFake(() => {
            return undefined;
        });
        expect(gameManager.isGameFound('')).to.equal(false);
    });

    it('should return game info', () => {
        const expectedGame = stub(
            new Game(
                { player: { name: 'test', id: '' }, isMulti: false },
                { info: { id: '1' } as PrivateGameInformation, mode: GameMode.LimitedTime },
            ),
        );
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        expect(gameManager.getGameInfo('1')).to.deep.equal({ id: '1' });
    });

    it('should set the next game in the array', () => {
        const expectedGame = stub(
            new Game({ player: { name: 'test', id: '' }, isMulti: false }, { info: { id: '1' } as PrivateGameInformation, mode: GameMode.Classic }),
        );
        stub(limitedTimeService, 'getGamesToPlay').callsFake(() => [{ id: '1' } as PrivateGameInformation, { id: '2' } as PrivateGameInformation]);
        const findGameStub = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        gameManager.setNextGame('1');
        expect(findGameStub.called).to.equal(true);
        expect(expectedGame.setInfo.called).to.equal(true);
        expectedGame.currentIndex = 2;
        gameManager.setNextGame('1');
        expect(expectedGame.setInfo.called).to.equal(true);
    });

    it('should not set next game if array is undefined', () => {
        const expectedGame = stub(
            new Game(
                { player: { name: 'test', id: '' }, isMulti: false },
                { info: { id: '1' } as PrivateGameInformation, mode: GameMode.LimitedTime },
            ),
        );
        stub(limitedTimeService, 'getGamesToPlay').callsFake(() => undefined);
        const findGameStub = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        gameManager.setNextGame('1');
        expect(findGameStub.called).to.equal(true);
        expect(expectedGame.setInfo.called).to.equal(false);
    });

    it('should not set the next game when index is maxed out', () => {
        const expectedGame = stub(
            new Game(
                { player: { name: 'test', id: '' }, isMulti: false },
                { info: { id: '1' } as PrivateGameInformation, mode: GameMode.LimitedTime },
            ),
        );
        stub(limitedTimeService, 'getGamesToPlay').callsFake(() => [{ id: '1' } as PrivateGameInformation, { id: '2' } as PrivateGameInformation]);
        const findGameStub = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        gameManager.setNextGame('1');
        expect(findGameStub.called).to.equal(true);
        expect(expectedGame.setInfo.called).to.equal(false);
    });
    it('should set one game card to deleted', () => {
        const expectedGame = new Game(
            { player: { name: 'test', id: '' }, isMulti: false },
            { info: { id: '1' } as PrivateGameInformation, mode: GameMode.Classic },
        );
        const secondExpectedGame = new Game(
            { player: { name: 'test', id: '' }, isMulti: false },
            { info: { id: '2' } as PrivateGameInformation, mode: GameMode.Classic },
        );
        expect(gameManager.gameCardDeletedHandle('1'));
        gameManager['games'].set('1', expectedGame);
        gameManager['games'].set('2', secondExpectedGame);

        expect(expectedGame.isCardDeleted).to.equal(false);
        gameManager.gameCardDeletedHandle('1');
        gameManager.gameCardDeletedHandle('3');
        expect(expectedGame.isCardDeleted).to.equal(true);
        expect(secondExpectedGame.isCardDeleted).to.equal(false);
    });

    it('should set all cards to deleted', () => {
        const expectedGame = new Game(
            { player: { name: 'test', id: '' }, isMulti: false },
            { info: { id: '1' } as PrivateGameInformation, mode: GameMode.Classic },
        );
        gameManager.allGameCardsDeleted();
        gameManager['games'].set('1', expectedGame);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);

        expect(expectedGame.isCardDeleted).to.equal(false);
        gameManager.allGameCardsDeleted();
        expect(expectedGame.isCardDeleted).to.equal(true);
    });

    it('should return is game card is deleted', () => {
        const expectedGame = new Game(
            { player: { name: 'test', id: '' }, isMulti: false },
            { info: { id: '1' } as PrivateGameInformation, mode: GameMode.Classic },
        );
        gameManager['games'].set('1', expectedGame);

        expect(gameManager.isGameCardDeleted('1')).to.equal(false);
        expect(gameManager.isGameCardDeleted('2')).to.equal(null);
        gameManager.allGameCardsDeleted();
        expect(gameManager.isGameCardDeleted('1')).to.equal(true);
    });

    it('should check if the game is over', () => {
        const gameFoundSpy = stub(gameManager, 'isGameFound').callsFake(() => false);
        const expectedGame = stub(
            new Game({ player: { name: 'test', id: '' }, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic }),
        );
        expectedGame.isGameOver.callsFake(() => false);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        expect(gameManager.isGameOver('')).to.equal(null);
        expect(gameFoundSpy.called).to.equal(true);

        gameFoundSpy.callsFake(() => true);
        expect(gameManager.isGameOver('')).to.equal(false);
        expectedGame.isGameOver.callsFake(() => true);
        expect(gameManager.isGameOver('')).to.equal(true);
    });

    it('should check if the difference left', () => {
        const findGameSpy = stub(gameManager, 'isGameFound').callsFake(() => false);
        expect(gameManager.nbDifferencesLeft('')).to.equal(null);

        findGameSpy.callsFake(() => true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(
            () =>
                new Game(
                    { player: {} as User, isMulti: false },
                    { info: { differences: [] as Coordinate[][] } as PrivateGameInformation, mode: GameMode.Classic },
                ),
        );
        stub(difference, 'nbDifferencesLeft').callsFake(() => 0);
        expect(gameManager.nbDifferencesLeft('')).equal(0);
    });

    it('should find a game', () => {
        expect(gameManager['findGame']('')).to.equal(undefined);
        const expectedIdGame = '';
        const expectedGame = { identifier: expectedIdGame } as Game;
        gameManager['games'].set(expectedIdGame, expectedGame);
        expect(gameManager['findGame'](expectedIdGame)).to.deep.equal(expectedGame);
    });

    it('should check if the game is found and the difference is not null', () => {
        const findGameSpy = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(null);
        const game = {} as unknown as Game;
        stub(difference, 'isDifferenceFound').callsFake(() => null);
        findGameSpy.callsFake(() => game);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(null);
    });

    it('should return the difference within a specific coord', () => {
        const expectedDifferences = [{} as Coordinate];
        stub(difference, 'isDifferenceFound').callsFake(() => expectedDifferences);
        const game = {} as unknown as Game;
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        expect(gameManager.isDifference('', '', { x: 0, y: 0 })).to.deep.equal(expectedDifferences);
    });

    it('should check if the game is full', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
        stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        const spyIsGameFull = stub(game, 'isGameFull').callsFake(() => false);
        expect(gameManager.isGameAlreadyFull('')).to.equal(false);
        spyIsGameFull.callsFake(() => true);
        expect(gameManager.isGameAlreadyFull('')).to.equal(true);
    });

    it('should add player', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const spyAddPlayer = stub(game, 'addPlayer');
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.addPlayer({ name: '', id: '' }, '');
        expect(spyAddPlayer.called).to.equal(true);
    });
    it('should check if the game is in multiplayer', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        expect(gameManager.isGameMultiplayer('')).to.equal(undefined);
        spyFindGame.callsFake(() => game);
        expect(gameManager.isGameMultiplayer('')).to.equal(false);
        game['isMulti'] = true;
        expect(gameManager.isGameMultiplayer('')).to.equal(true);
    });

    it('should leave game', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyLeaveGame = stub(game, 'leaveGame').callsFake(() => {});
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(false);
        spyFindGame.callsFake(() => game);
        gameManager.leaveGame('', '');
        expect(spyLeaveGame.called).to.equal(true);
    });

    it('should increase number of clues ', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        spyFindGame.callsFake(() => undefined);
        gameManager.increaseNbClueAsked('');
        expect(game.nbCluesAsked).to.equal(0);
        spyFindGame.callsFake(() => game);
        gameManager.increaseNbClueAsked('');
        expect(game.nbCluesAsked).to.equal(1);
    });

    it('should return the number of clues  ', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
        spyFindGame.callsFake(() => undefined);
        const numberOfCluesForUndefinedGame = gameManager.getNbClues('');
        expect(numberOfCluesForUndefinedGame).to.equal(undefined);
        spyFindGame.callsFake(() => game);
        const numberOfClues = gameManager.getNbClues('');
        expect(numberOfClues).to.equal(0);
    });

    // it('should delete a game if all player leave', () => {
    //     const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
    //     stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => game);
    //     const spyDeleteGame = stub(gameManager.games, 'delete');
    //     const spyhasNoPlayer = stub(game, 'hasNoPlayer').callsFake(() => false);
    //     gameManager.leaveGame('', '');
    //     expect(spyDeleteGame.called).to.equal(false);
    //     spyhasNoPlayer.callsFake(() => true);
    //     gameManager.leaveGame('', '');
    //     expect(spyDeleteGame.called).to.equal(true);
    // });

    it('should return a object that represent a difference found in solo', () => {
        const expectedDifference = { coords: [], nbDifferencesLeft: 2 };
        stub(gameManager, 'isGameOver').callsFake(() => false);
        stub(gameManager, 'isDifference').callsFake(() => []);
        stub(gameManager, 'nbDifferencesLeft').callsFake(() => 2);
        expect(gameManager.getNbDifferencesFound([], '')).to.deep.equal(expectedDifference);
    });

    it('should return a object that represent a difference found in multi', () => {
        const expectedDifference = { coords: [], nbDifferencesLeft: 2, isPlayerFoundDifference: false };
        stub(gameManager, 'nbDifferencesLeft').callsFake(() => 2);
        expect(gameManager.getNbDifferencesFound([], '', false)).to.deep.equal(expectedDifference);
    });

    it('should send timer to a player', async () => {
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        const expectedGame = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const expectedTimer = {} as NodeJS.Timer;
        // eslint-disable-next-line no-unused-vars -- callback
        const spyInterval = stub(global, 'setInterval').callsFake((callback: (args: void) => void, ms?: number | undefined) => {
            return expectedTimer;
        });
        gameManager.sendTimer({} as Server, '', '');
        expect(spyInterval.called).to.equal(false);
        spyFindGame.callsFake(() => expectedGame);
        gameManager.sendTimer(
            {
                sockets: {
                    to: () => {
                        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake Emit and return {}
                        return { emit: () => {} };
                    },
                },
            } as unknown as Server,
            '',
            '',
        );
        expect(spyInterval.called).to.equal(true);
        expect(expectedGame.timerId).to.equal(expectedTimer);
    });
    it('should clear a timer of a game', () => {
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => undefined);
        const expectedGame = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const spyClearInterval = stub(global, 'clearInterval').callsFake(() => {});
        gameManager.deleteTimer('');
        expect(spyClearInterval.called).to.equal(false);
        spyFindGame.callsFake(() => expectedGame);
        gameManager.deleteTimer('');
        expect(spyClearInterval.called).to.equal(true);
    });

    it('should get all nb of difference not found', () => {
        const expectedGame = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const expectedDifferenceNotFound = [[{ x: 0, y: 0 }]];
        const spyFindGame = stub(Object.getPrototypeOf(gameManager), 'findGame').callsFake(() => expectedGame);
        stub(difference, 'getAllDifferencesNotFound').callsFake(() => expectedDifferenceNotFound);
        expect(gameManager.getNbDifferenceNotFound('')).to.deep.equal(expectedDifferenceNotFound);
        spyFindGame.callsFake(() => undefined);
        expect(gameManager.getNbDifferenceNotFound('')).to.equal(undefined);
    });
});
