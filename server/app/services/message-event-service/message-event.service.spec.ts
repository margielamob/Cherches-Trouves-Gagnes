import { EventMessageService } from '@app/services/message-event-service/message-event.service';
import { expect } from 'chai';
import { describe } from 'mocha';
import { Container } from 'typedi';
import { SinonFakeTimers, useFakeTimers } from 'sinon';

describe('EventMessage Service', () => {
    let eventMessageService: EventMessageService;
    let clock: SinonFakeTimers;

    beforeEach(() => {
        eventMessageService = Container.get(EventMessageService);
        clock = useFakeTimers();
    });

    afterEach(() => {
        clock.restore();
    });

    it('Should return a multiplayer difference found message with the player name if exists and if its a multiplayer game', () => {
        const userName = 'user';
        const expectedResult = `Difference trouvée par ${userName} a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference found message with the player name if exists and if its solo game', () => {
        const userName = 'user';
        const expectedResult = `Difference trouvée a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceFoundMessage(userName, false)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference found message if player name is undefined even if its a multiplayer game', () => {
        const userName = undefined;
        const expectedResult = `Difference trouvée a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a multiplayer difference not found message with the player name if exists and if its a multiplayer game', () => {
        const userName = 'user';
        const expectedResult = `Erreur par ${userName} a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference not found message with the player name if exists and if its a solo game', () => {
        const userName = 'user';
        const expectedResult = `Erreur a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, false)).to.be.equal(expectedResult);
    });

    it('Should return a solo difference not found message if player name is undefined even if its a multiplayer game', () => {
        const userName = undefined;
        const expectedResult = `Erreur a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.differenceNotFoundMessage(userName, true)).to.be.equal(expectedResult);
    });

    it('Should return a leaving game message if username exists ', () => {
        const userName = 'user';
        const expectedResult = `${userName} a abandonné la partie a ${new Date(0).toLocaleTimeString('en-US')}`;
        expect(eventMessageService.leavingGameMessage(userName)).to.be.equal(expectedResult);
    });

    it('Should return null  if username is undefined while sending a leaving event message ', () => {
        const userName = undefined;
        expect(eventMessageService.leavingGameMessage(userName)).to.be.equal(null);
    });

    it('Should return a clue used message if user wants to have a hint ', () => {
        const expectedResult = `${new Date().toLocaleTimeString('en-US')} - Indice Utilisé`;
        expect(eventMessageService.usingClueMessage()).to.be.equal(expectedResult);
    });

    it('should send a message when there is a new high score in multi', () => {
        const messageRecord = {
            record: { index: 1, time: 1000 },
            playerName: 'user',
            gameName: 'game',
            isMulti: true,
        };
        const expectedResult = `${new Date(0).toLocaleTimeString('en-US')} - 
        ${messageRecord.playerName} obtient la ${messageRecord.record.index} place dans les meilleurs temps du jeu 
        ${messageRecord.gameName} en multijoueur`;
        expect(eventMessageService.sendNewHighScoreMessage(messageRecord)).to.be.equal(expectedResult);
    });

    it('should send a message when there is a new high score in solo', () => {
        const messageRecord = {
            record: { index: 1, time: 1000 },
            playerName: 'user',
            gameName: 'game',
            isMulti: false,
        };
        const expectedResult = `${new Date(0).toLocaleTimeString('en-US')} - 
        ${messageRecord.playerName} obtient la ${messageRecord.record.index} place dans les meilleurs temps du jeu 
        ${messageRecord.gameName} en solo`;
        expect(eventMessageService.sendNewHighScoreMessage(messageRecord)).to.be.equal(expectedResult);
    });
});
