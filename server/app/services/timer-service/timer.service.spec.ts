// import { Game } from '@app/classes/game/game';
// import { PrivateGameInformation } from '@app/interface/game-info';
// import { DifferenceService } from '@app/services/difference-service/difference.service';
// import { GameTimeConstantService } from '@app/services/game-time-constant/game-time-constants.service';
// import { TimerService } from '@app/services/timer-service/timer.service';
// import { GameMode } from '@common/game-mode';
// import { GameTimeConstants } from '@common/game-time-constants';
// import { User } from '@common/user';
// import { expect } from 'chai';
// import { restore, SinonFakeTimers, stub, useFakeTimers } from 'sinon';
// import { Container } from 'typedi';

// describe('TimerService', () => {
//     let gameTimerConstant: GameTimeConstantService;
//     let difference: DifferenceService;
//     let timer: TimerService;
//     let clock: SinonFakeTimers;
//     let game: Game;

//     beforeEach(() => {
//         difference = Container.get(DifferenceService);
//         gameTimerConstant = Container.get(GameTimeConstantService);
//         timer = new TimerService(difference, gameTimerConstant);
//         game = new Game({ player: {} as User, isMulti: false }, { info: {} as PrivateGameInformation, mode: GameMode.Classic });
//         clock = useFakeTimers();
//     });

//     afterEach(() => {
//         restore();
//         clock.restore();
//     });
//     it('should get the seconds of the timer of the game', () => {
//         stub(Object.getPrototypeOf(timer), 'calculateTime').callsFake(() => 2);
//         expect(timer.seconds(game)).to.equal(2);
//     });

//     it('should time not found or total difference found not found', () => {
//         const gameTime = stub(Object.getPrototypeOf(timer), 'gameTime').callsFake(() => null);
//         expect(timer['calculateLimitedGameTimer']({} as Game)).to.equal(0);
//         gameTime.callsFake(() => {
//             return { constant: {} as GameTimeConstants, init: new Date() };
//         });
//         stub(difference, 'totalDifferenceFound').callsFake(() => undefined);
//         expect(timer['calculateLimitedGameTimer']({} as Game)).to.equal(0);
//         gameTime.callsFake(() => null);
//         expect(timer['calculateLimitedGameTimer']({} as Game)).to.equal(0);
//     });

//     it('should return 0 if no timer found', () => {
//         game['id'] = 'idNotFound';
//         expect(timer['calculateTime'](game)).to.equal(0);
//     });

//     it('should not get the game constant timer', () => {
//         stub(timer['timerConstant'], 'get').callsFake(() => undefined);
//         expect(timer['gameTime']('')).to.equal(null);
//     });

//     // it('should get the game constant timer', () => {
//     //     const expectedGameTimerConstant = {} as GameTimeConstants;
//     //     const currentTime = new Date();
//     //     timer['timerConstant'] = new Map();
//     //     timer['initialTime'] = new Map();
//     //     stub(timer['timerConstant'], 'get').callsFake(() => expectedGameTimerConstant);
//     //     stub(timer['initialTime'], 'get').callsFake(() => currentTime);
//     //     expect(timer['gameTime']('')).to.deep.equal({ constant: expectedGameTimerConstant, init: currentTime });
//     // });

//     it('should return 0 for timer if less than 0', () => {
//         stub(Object.getPrototypeOf(timer), 'gameTime').callsFake(() => {
//             return { constant: { gameTime: 30, successTime: 0, penaltyTime: 60 }, init: new Date() };
//         });
//         game['nbCluesAsked'] = 1;
//         stub(difference, 'totalDifferenceFound').callsFake(() => new Set());
//         expect(timer['calculateLimitedGameTimer'](game)).to.equal(0);
//     });
// });
