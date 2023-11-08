/* eslint-disable max-lines */
import { EndGameState } from '@app/classes/end-game-state/end-game-state';
import { Game } from '@app/classes/game/game';
import { InitGameState } from '@app/classes/init-game-state/init-game-state';
import { InitTimerState } from '@app/classes/init-timer-state/init-timer-state';
import { GameStatus } from '@app/enum/game-status';
import { PrivateGameInformation } from '@app/interface/game-info';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { Score } from '@common/score';
import { User } from '@common/user';
import { expect } from 'chai';
import { SinonFakeTimers, stub, useFakeTimers } from 'sinon';

describe('Game', () => {
    let game: Game;
    let clock: SinonFakeTimers;
    const expectedGameInfo: PrivateGameInformation = {
        id: '1',
        idOriginalBmp: '0',
        thumbnail: 'thumbnail',
        idEditedBmp: '1',
        soloScore: [{} as Score],
        multiplayerScore: [{} as Score],
        name: 'test game',
        differenceRadius: 0,
        differences: [[{} as Coordinate]],
    };
    const expectedPlayer = { player: { name: 'test player', id: 'test' }, isMulti: false };
    const expectedMode = GameMode.Classic;
    beforeEach(() => {
        game = new Game(expectedPlayer, { info: expectedGameInfo, mode: expectedMode });
        clock = useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('should create a game with specific mode, players and game information', () => {
        const expectedGameState = new InitTimerState();
        const newGame = new Game(expectedPlayer, { info: expectedGameInfo, mode: expectedMode });
        expect(newGame.information).to.deep.equal(expectedGameInfo);
        expect(newGame['players'].has(expectedPlayer.player.id)).to.equal(true);
        expect(newGame['isMulti']).to.deep.equal(expectedPlayer.isMulti);
        expect(newGame['context'].gameMode).to.equal(expectedMode as GameMode);
        expect(newGame['context'].gameState()).to.equal(expectedGameState.status());
    });

    it('should get the id of the game', () => {
        expect(game.identifier).to.equal(game['id']);
    });

    it('should return the game mode', () => {
        expect(game.gameMode).to.equal(GameMode.Classic);
    });

    it('should get the information of the game', () => {
        expect(game.information).to.equal(expectedGameInfo);
    });

    it('should set end game', () => {
        game.setEndgame();
        expect(game['context'].gameState()).to.equal(GameStatus.EndGame);
    });

    it('should get the status of the game', () => {
        const expectGameState = new InitGameState();
        stub(game['context'], 'gameState').callsFake(() => expectGameState.status());
        expect(game.status).to.equal(expectGameState.status());
    });

    it('should set info', () => {
        const gameInfo = { id: '1' } as PrivateGameInformation;
        game.setInfo(gameInfo);
        expect(game.information).to.equal(gameInfo);
    });

    it('should increment index', () => {
        expect(game.currentIndex).to.equal(0);
        game.nextIndex();
        expect(game.currentIndex).to.equal(1);
    });

    it('should go to the next state of the game', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const stateSpyObj = stub(game['context'], 'next').callsFake(() => {});
        game.next();
        expect(stateSpyObj.called).to.equal(true);
    });

    it('should check if the game is on initialize', () => {
        const stateSpyObj = stub(game['context'], 'gameState').callsFake(() => GameStatus.InitGame);
        expect(game.isGameInitialize()).to.equal(true);
        expect(stateSpyObj.called).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.InitTimer);
        expect(game.isGameInitialize()).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.EndGame);
        expect(game.isGameInitialize()).to.equal(false);
    });

    it('should return if the game is deleted', () => {
        expect(game.isCardDeleted).to.equal(false);
        game.setGameCardDeleted();
        expect(game.isCardDeleted).to.equal(true);
    });

    it('should return if the game is limited time ', () => {
        const gameInfo: PrivateGameInformation = {
            id: '1',
            idOriginalBmp: '0',
            thumbnail: 'thumbnail',
            idEditedBmp: '1',
            soloScore: [{} as Score],
            multiplayerScore: [{} as Score],
            name: 'test game',
            differenceRadius: 0,
            differences: [[{} as Coordinate]],
        };
        const player = { player: { name: 'test player', id: 'test' }, isMulti: false };
        const mode = GameMode.LimitedTime;
        const newGame = new Game(player, { info: gameInfo, mode });
        expect(newGame.isLimitedTime()).to.equal(true);
    });

    it('should check if the game is over', () => {
        const stateSpyObj = stub(game['context'], 'gameState').callsFake(() => GameStatus.InitGame);
        expect(game.isGameOver()).to.equal(false);
        expect(stateSpyObj.called).to.equal(true);
        stateSpyObj.callsFake(() => GameStatus.InitTimer);
        expect(game.isGameOver()).to.equal(false);
        stateSpyObj.callsFake(() => GameStatus.EndGame);
        expect(game.isGameOver()).to.equal(true);
    });

    it('should get if the game is in multi or not', () => {
        expect(game.multi).to.equal(false);
        game['isMulti'] = true;
        expect(game.multi).to.equal(true);
    });
    it('should not add a player if the game is full', () => {
        const expectedPlayer1 = {} as User;
        const spyIsGameFull = stub(game, 'isGameFull').callsFake(() => true);
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
        game['isMulti'] = true;
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
        spyIsGameFull.callsFake(() => true);
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(false);
    });

    it('should add a player in a game if the game is not full', () => {
        stub(game, 'isGameFull').callsFake(() => false);
        const expectedPlayer1 = { name: 'test', id: '' };
        game['isMulti'] = true;
        game.addPlayer(expectedPlayer1);
        expect(game.players.has(expectedPlayer1.id)).to.equal(true);
    });
    it('should leave a game if the player is found', () => {
        const spyDeletePlayer = stub(game.players, 'delete');
        const expectedPlayer1 = { name: 'test', id: '1' };
        game.leaveGame(expectedPlayer1.id);
        expect(spyDeletePlayer.called).to.equal(false);
        game.leaveGame(expectedPlayer.player.id);
        // expect(game.players.has(expectedPlayer.player.id)).to.equal(false);
        const endGameState = new EndGameState();
        expect(game.status).to.equal(endGameState.status());
    });

    it('should check if all player leave', () => {
        expect(game.hasNoPlayer()).to.equal(false);
        game.players = new Map();
        expect(game.hasNoPlayer()).to.equal(true);
    });
});
