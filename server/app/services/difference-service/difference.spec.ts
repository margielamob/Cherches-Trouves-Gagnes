/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Game } from '@app/classes/game/game';
import { PrivateGameInformation } from '@app/interface/game-info';
import { DifferenceService } from '@app/services/difference-service/difference.service';
import { Coordinate } from '@common/coordinate';
import { GameMode } from '@common/game-mode';
import { User } from '@common/user';
import { expect } from 'chai';
import { restore, spy, stub } from 'sinon';

describe('DifferenceService', () => {
    let difference: DifferenceService;
    beforeEach(() => {
        difference = new DifferenceService();
    });

    afterEach(() => {
        restore();
    });

    it('should return the threshold to win a game', () => {
        const expectedDifferencesRef = [[{} as Coordinate], [{} as Coordinate], [{} as Coordinate], [{} as Coordinate]];
        expect(difference.getNbDifferencesThreshold(expectedDifferencesRef)).to.equal(2);
        expectedDifferencesRef.push([{} as Coordinate]);
        expect(difference.getNbDifferencesThreshold(expectedDifferencesRef)).to.equal(3);
    });

    it('should find all difference not found', () => {
        const expectedDifferences = [
            [
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            ],
            [{ x: 3, y: 2 }],
        ];
        difference['gamesDifferencesTotalFound'].set('', new Set());
        expect(difference.getAllDifferencesNotFound(expectedDifferences, '')).to.deep.equal(expectedDifferences);
        difference['gamesDifferencesTotalFound'].get('')?.add(expectedDifferences[0]);
        expect(difference.getAllDifferencesNotFound(expectedDifferences, '')).to.deep.equal([expectedDifferences[1]]);
    });

    it('should get the number of difference not found', () => {
        const expectedDifference = { length: 10 } as Coordinate[][];
        const expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        difference['gamesDifferencesTotalFound'].set('', expectedDifferenceFound);
        expect(difference.nbDifferencesLeft(expectedDifference, '')).to.equal(expectedDifference.length - expectedDifferenceFound.size);
    });

    it('before check if all difference found check if the game is on init or over', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        difference['gamesDifferencesFound'].set(game.identifier, new Map());
        difference['gamesDifferencesFound'].get('')?.set('', new Set());
        const initSpy = stub(game, 'isGameInitialize').callsFake(() => false);
        const overSpy = stub(game, 'isGameOver').callsFake(() => false);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);
        expect(initSpy.called).to.equal(true);
        expect(overSpy.called).to.equal(true);

        initSpy.callsFake(() => true);
        overSpy.callsFake(() => false);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);

        initSpy.callsFake(() => false);
        overSpy.callsFake(() => true);
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);

        game['isMulti'] = true;
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);
    });

    it('should check if all difference is found', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        stub(game, 'isGameInitialize').callsFake(() => false);
        stub(game, 'isGameOver').callsFake(() => false);
        let expectedDifference = { length: 10 } as Coordinate[][];
        let expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].set(game.identifier, new Map());
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);

        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 10 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);

        game['isMulti'] = true;
        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 4 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        expect(difference.isAllDifferenceFound('', game)).to.equal(false);

        game['isMulti'] = true;
        expectedDifference = { length: 10 } as Coordinate[][];
        expectedDifferenceFound = { size: 5 } as Set<Coordinate[]>;
        game['info'].differences = expectedDifference;
        difference['gamesDifferencesFound'].get(game.identifier)?.set('', expectedDifferenceFound);
        stub(difference, 'getNbDifferencesThreshold').callsFake(() => 5);
        expect(difference.isAllDifferenceFound('', game)).to.equal(true);
    });

    it('should add a difference founded', () => {
        const expectedPlayerId = '';
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        difference['gamesDifferencesFound'].set(game.identifier, new Map());
        difference['gamesDifferencesTotalFound'].set(game.identifier, new Set());
        difference['gamesDifferencesFound'].get(game.identifier)?.set(expectedPlayerId, new Set());
        const isAlreadyDifferenceFoundSpy = stub(difference, 'isDifferenceAlreadyFound').callsFake(() => true);
        const isAllDifferenceFoundSpy = stub(difference, 'isAllDifferenceFound').callsFake(() => false);
        const isGameOverSpy = stub(game, 'isGameOver').callsFake(() => true);
        const getNbDifferencesFoundSpy = stub(
            difference['gamesDifferencesFound'].get(game.identifier)?.get(expectedPlayerId) as Set<Coordinate[]>,
            'add',
        );
        difference.addCoordinatesOnDifferenceFound(expectedPlayerId, [{} as Coordinate], game);
        expect(isAlreadyDifferenceFoundSpy.called).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(false);
        expect(isGameOverSpy.called).to.equal(false);
        expect(getNbDifferencesFoundSpy.called).to.equal(false);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        const expectedCoordinates = [{ x: 0, y: 0 }];
        difference.addCoordinatesOnDifferenceFound(expectedPlayerId, expectedCoordinates, game);
        expect(isAlreadyDifferenceFoundSpy.calledTwice).to.equal(true);
        expect(isAllDifferenceFoundSpy.called).to.equal(true);
        expect(getNbDifferencesFoundSpy.called).to.equal(true);

        isAlreadyDifferenceFoundSpy.callsFake(() => false);
        isAllDifferenceFoundSpy.callsFake(() => true);
        const nextStateSpy = spy(game['context'], 'end');
        isGameOverSpy.callsFake(() => false);
        difference.addCoordinatesOnDifferenceFound(expectedPlayerId, [{} as Coordinate], game);
        expect(getNbDifferencesFoundSpy.called).to.equal(true);
        expect(nextStateSpy.called).to.equal(true);
    });

    it('should verify if the difference is already found', () => {
        const expectedGameId = '';
        difference['gamesDifferencesTotalFound'].set('', new Set());
        const getNbDifferencesFoundSpy = stub(difference['gamesDifferencesTotalFound'].get('') as Set<Coordinate[]>, 'has').callsFake(() => false);
        expect(difference.isDifferenceAlreadyFound([{} as Coordinate], expectedGameId)).to.equal(false);
        getNbDifferencesFoundSpy.callsFake(() => true);
        expect(difference.isDifferenceAlreadyFound([{} as Coordinate], expectedGameId)).to.equal(true);
    });

    it('should return undefined if differences is not found with coordinate', () => {
        const expectedDifferences = [[{} as Coordinate]];
        expect(difference.findDifference({ x: 0, y: 0 }, expectedDifferences)).to.equal(undefined);
    });

    it('should find a difference and return it', () => {
        const expectedDifferencesFound = [
            { x: 0, y: 0 },
            { x: 1, y: -1 },
        ];
        const expectedDifferences = [expectedDifferencesFound];
        expect(difference.findDifference({ x: 0, y: 0 }, expectedDifferences)).to.deep.equal(expectedDifferencesFound);
    });

    it('should return null if no difference is found or already found', () => {
        const game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
        const findDifferenceSpy = stub(difference, 'findDifference').callsFake(() => undefined);
        expect(difference.isDifferenceFound('', {} as Coordinate, game)).to.equal(null);
        expect(findDifferenceSpy.called).to.equal(true);
        const expectedDifferences = [] as Coordinate[];
        findDifferenceSpy.callsFake(() => expectedDifferences);
        const isDifferenceAlreadyFoundSpy = stub(difference, 'isDifferenceAlreadyFound').callsFake(() => true);
        expect(difference.isDifferenceFound('', {} as Coordinate, game)).to.equal(null);
        expect(isDifferenceAlreadyFoundSpy.called).to.equal(true);
        isDifferenceAlreadyFoundSpy.callsFake(() => false);
        // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake and return {}
        const addCoordinatesOnDifferenceFoundSpy = stub(difference, 'addCoordinatesOnDifferenceFound').callsFake(() => {});
        expect(difference.isDifferenceFound('', {} as Coordinate, game)).to.equal(expectedDifferences);
        expect(addCoordinatesOnDifferenceFoundSpy.called).to.equal(true);
    });
});
