import { expect } from 'chai';
import { stub } from 'sinon';
import { Container } from 'typedi';
import { MultiplayerGameManager } from './multiplayer-game-manager.service';

describe('Multiplayer Game Manager', () => {
    let multiplayerGameManager: MultiplayerGameManager;

    beforeEach(() => {
        multiplayerGameManager = Container.get(MultiplayerGameManager);
    });

    it('should be true if theres only one request', () => {
        expect(multiplayerGameManager.theresOneRequest('')).to.equal(false);
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        expect(multiplayerGameManager.theresOneRequest('room')).to.equal(true);
    });

    it('should be true if theres no request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        expect(multiplayerGameManager.theresARequest('room')).to.equal(false);
        multiplayerGameManager.requestsOnHold.set('room', [{ name: 'name', id: '1' }]);
        expect(multiplayerGameManager.theresARequest('')).to.equal(false);
        expect(multiplayerGameManager.theresARequest('room')).to.equal(true);
    });

    it('should return true if its not a current players request', () => {
        expect(multiplayerGameManager.isNotAPlayersRequest('1', '1')).to.equal(false);
        expect(multiplayerGameManager.isNotAPlayersRequest('1', '2')).to.equal(true);
    });

    it('should add new Request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).equal(1);

        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).equal(2);
    });

    it('should delete first request', () => {
        multiplayerGameManager.requestsOnHold = new Map();

        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        multiplayerGameManager.deleteFirstRequest('room');

        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(1);
        multiplayerGameManager.deleteFirstRequest('room');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(0);

        multiplayerGameManager.requestsOnHold = new Map();
        expect(multiplayerGameManager.deleteFirstRequest('room') === undefined).to.equal(true);
    });

    it('should get the oldest request', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });

        const result = multiplayerGameManager.getNewRequest('room');
        expect(result.name).to.equal('name');
        expect(result.id).to.equal('1');
    });

    it('should return if the request exists', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        let response = multiplayerGameManager.playersRequestExists('room', '1');
        expect(response).to.equal(false);

        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        response = multiplayerGameManager.playersRequestExists('room', '1');
        expect(response).to.equal(true);
        response = multiplayerGameManager.playersRequestExists('room', '2');
        expect(response).to.equal(false);
        response = multiplayerGameManager.playersRequestExists('room1', '1');
        expect(response).to.equal(false);
    });

    it('should delete all requests of a room', () => {
        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        multiplayerGameManager.deleteAllRequests('room');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(undefined);
    });

    it('should get request of a specific gameId', () => {
        const expectedRequestsStack = [{ name: 'test', id: '' }];
        multiplayerGameManager.requestsOnHold.set('testGame', expectedRequestsStack);
        expect(multiplayerGameManager.getRequest('')).to.deep.equal([]);
        expect(multiplayerGameManager.getRequest('testGame')).to.deep.equal(expectedRequestsStack);
    });

    it('should initialize the messages', () => {
        multiplayerGameManager['initializeRejectMessages']();

        expect(multiplayerGameManager.rejectMessages.deletedGame).to.equal('le jeu a été supprimé');
        expect(multiplayerGameManager.rejectMessages.wrongName).to.equal('vous devez choisir un autre nom de joueur');
        expect(multiplayerGameManager.rejectMessages.playerQuit).to.equal('le joueur a quitté.');
        expect(multiplayerGameManager.rejectMessages.rejected).to.equal('le joueur a refusé votre demande.');
        expect(multiplayerGameManager.rejectMessages.gameStarted).to.equal('la partie a déjà commencé.');
    });

    it('should delete a request', () => {
        multiplayerGameManager.deleteRequest('room', '4');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(0);

        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.deleteRequest('room', '4');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(0);

        multiplayerGameManager.requestsOnHold = new Map();
        multiplayerGameManager.addNewRequest('room', { name: 'name', id: '1' });
        multiplayerGameManager.addNewRequest('room', { name: 'name2', id: '2' });
        multiplayerGameManager.addNewRequest('room', { name: 'name3', id: '3' });
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(3);

        multiplayerGameManager.deleteRequest('room', '3');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(2);

        multiplayerGameManager.deleteRequest('room', '2');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(1);

        multiplayerGameManager.deleteRequest('room', '6');
        expect(multiplayerGameManager.requestsOnHold.get('room')?.length).to.equal(1);

        multiplayerGameManager.deleteRequest('room1', '2');
        expect(multiplayerGameManager.requestsOnHold.get('room1')?.length).to.equal(0);

        stub(multiplayerGameManager, 'getRequest').callsFake(() => undefined);
        multiplayerGameManager.deleteRequest('room1', '2');
        expect(multiplayerGameManager.requestsOnHold.get('room1')?.length).to.equal(0);
    });
});
