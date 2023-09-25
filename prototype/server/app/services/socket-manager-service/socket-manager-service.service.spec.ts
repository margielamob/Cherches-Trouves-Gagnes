/* eslint-disable max-lines */
import { PrivateGameInformation } from '@app/interface/game-info';
import { Server } from '@app/server';
import { SocketManagerService } from '@app/services/socket-manager-service/socket-manager-service.service';
import { GameMode } from '@common/game-mode';
import { SocketEvent } from '@common/socket-event';
import { User } from '@common/user';
import { expect } from 'chai';
import { restore, stub } from 'sinon';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Container } from 'typedi';

/* eslint-disable no-unused-vars -- tests for socket */
/* eslint-disable @typescript-eslint/no-explicit-any -- tests for socket -> socket as any*/
/* eslint-disable @typescript-eslint/no-empty-function -- tests for socket with callbacks*/
describe('SocketManager', () => {
    let server: Server;
    let service: SocketManagerService;
    beforeEach(() => {
        server = Container.get(Server);
        service = server['socketManager'];
    });

    afterEach(() => {
        restore();
    });

    it('should throw an error if the server is not set', () => {
        try {
            service.handleSockets();
        } catch (err) {
            expect(err.message).to.equal('Server instance not set');
        }
    });

    it('set the server', () => {
        service.server = server['server'];
        expect(service['sio']).to.not.equal(undefined);
    });

    it('should connect to socket', () => {
        let isConnect = false;
        const fakeSockets = {
            emit: (_eventName: string, _message: string) => {
                return;
            },
            to: (id: string) => {
                return;
            },
        };

        const fakeSocket = {
            on: (_eventName: string, callback: () => void) => {},
            emit: (_eventName: string, _message: string) => {
                return;
            },
            join: (id: string) => {
                return;
            },
            broadcast: fakeSockets,
        };

        service['sio'] = {
            sockets: fakeSockets,
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    isConnect = true;
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        service.handleSockets();
        expect(isConnect).to.equal(true);
    });

    it('should create a game in solo', async () => {
        const fakeSockets = {
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.CreateGame);
            },
        };

        const fakeSocket = {
            on: async (eventName: string, callback: () => Promise<void>) => {
                if (eventName === SocketEvent.CreateGame) {
                    await callback();
                }
            },
            emit: (eventName: string, message: string) => {
                return;
            },
            join: (id: string) => {
                return;
            },
            in: () => fakeSockets,
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'createGame')
            .callsFake(async () => new Promise(() => ''))
            .resolves();
        service.handleSockets();
    });

    it('should create a game in multi', async () => {
        const fakeSocket = {
            on: async (eventName: string, callback: () => Promise<void>) => {
                if (eventName === SocketEvent.CreateGameMulti) {
                    await callback();
                }
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service, 'createGameMulti')
            .callsFake(async () => new Promise(() => {}))
            .resolves();
        service.handleSockets();
    });

    it('should not leave a game if the game is not found', () => {
        const fakeSockets = {
            emit: (eventName: string, _message: string) => {
                expect(eventName).to.equal(SocketEvent.Error);
            },
        };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            emit: (eventName: string, message: string) => {
                return;
            },
            join: (id: string) => {
                return;
            },
            in: () => fakeSockets,
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => false);
        service.handleSockets();
    });

    it('should leave a game if the game is found', () => {
        const fakeSockets = {
            emit: (eventName: string, _message: string) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.EventMessage || eventName === SocketEvent.PlayerLeft).to.equal(
                    true,
                );
            },
        };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            broadcast: { to: () => fakeSockets },
            leave: () => {},
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        const spyMode = stub(service['gameManager'], 'isClassic').callsFake(() => true);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        const spyLeave = stub(fakeSocket, 'leave');
        stub(service['gameManager'], 'findPlayer').callsFake(() => 'test');
        const spyIsGameOver = stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        service.handleSockets();
        expect(spyLeave.called).to.equal(true);
        spyMode.callsFake(() => false);
        service.handleSockets();
        expect(spyLeave.calledTwice).to.equal(false);
        spyIsGameOver.callsFake(() => true);
        service.handleSockets();
    });

    it('should not broadcast leaving message when the player is in solo', () => {
        const fakeSockets = {
            emit: (eventName: string, _message: string) => {},
        };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveGame) callback();
            },
            broadcast: { to: () => fakeSockets },
            leave: () => {},
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => false);
        const spyEmit = stub(fakeSockets, 'emit');
        service.handleSockets();
        expect(spyEmit.called).to.equal(false);
    });

    it('should find difference if the game is not found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.Error);
            },
            join: (id: string) => {
                return;
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => false);
        service.handleSockets();
    });

    it('should return an error if no difference found and the game is found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: string) => {
                expect(eventName === SocketEvent.DifferenceNotFound || eventName === SocketEvent.EventMessage).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'findPlayer').callsFake(() => 'test');
        stub(service['gameManager'], 'isDifference').callsFake(() => null);
        service.handleSockets();
    });

    it('should return found difference in solo if the game is found and the difference found message', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const expectedEventMessage = `Difference trouvée a ${new Date().toLocaleTimeString('en-US')}`;
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.DifferenceFound || eventName === SocketEvent.EventMessage).to.equal(true);
                expect(message === expectedDifferenceFound || message === expectedEventMessage).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
            to: (id: string) => {
                return { emit: (eventName: string, message: unknown) => {} };
            },
            broadcast: {
                to: () => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.DifferenceFound);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (gameId: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isLimitedTime').callsFake(() => true);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        service.handleSockets();
    });

    it('should return found difference in solo if the game is found and game over the game', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.DifferenceFound || eventName === SocketEvent.EventMessage).to.equal(
                    true,
                );
            },
            join: (id: string) => {
                return;
            },
            broadcast: {
                to: () => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.DifferenceFound);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'isLimitedTime').callsFake(() => false);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        service.handleSockets();
    });

    it('should return found difference in multi if the game is found', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSockets = {
            emit: (eventName: string, message: unknown) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            to: (id: string) => {
                return { emit: (eventName: string, message: unknown) => {} };
            },
        };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.DifferenceFound || eventName === SocketEvent.EventMessage).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
            to: () => fakeSockets,
            broadcast: fakeSockets,
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'isLimitedTime').callsFake(() => true);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should return found difference in multi if the game is found and game over the game', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const fakeSockets = {
            emit: (eventName: string, message: unknown) => {
                expect(eventName).to.equal(SocketEvent.DifferenceFound);
                expect(message).to.deep.equal(expectedDifferenceFound);
            },
            to: (id: string) => {
                return {
                    emit: (eventName: string, message: unknown) => {
                        expect(eventName === SocketEvent.Lose || eventName === SocketEvent.DifferenceFound).to.equal(true);
                    },
                };
            },
        };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.DifferenceFound || eventName === SocketEvent.EventMessage).to.equal(
                    true,
                );
            },
            join: (id: string) => {
                return;
            },
            to: () => fakeSockets,
            broadcast: fakeSockets,
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'isLimitedTime').callsFake(() => true);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameOver').callsFake(() => true);
        stub(Object.getPrototypeOf(service), 'handleEndGame').callsFake(() => {});
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        service.handleSockets();
    });

    it('should get games waiting', () => {
        const expectedGames = { mode: undefined, gamesWaiting: ['game1', 'game2'] };

        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GetGamesWaiting) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName).to.equal(SocketEvent.GetGamesWaiting);
                expect(message).to.deep.equal(expectedGames);
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['multiplayerGameManager'], 'getGamesWaiting').callsFake(() => ['game1', 'game2']);
        service.handleSockets();
    });

    it('should handle a message receive from client', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Message) callback();
            },
            broadcast: {
                to: () => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.Message);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        service.handleSockets();
    });

    it('should reject player', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.RejectPlayer) callback();
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => {
                return {
                    emit: (eventName: string, message: unknown) => {
                        expect(eventName === SocketEvent.RequestToJoin || eventName === SocketEvent.RejectPlayer).to.equal(true);
                    },
                };
            },
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'deleteFirstRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresARequest').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getNewRequest').callsFake(() => {
            return { name: 'test', id: '' };
        });
        service.handleSockets();
    });
    it('should not reject request if no request is found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.RejectPlayer) callback();
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => {
                return {
                    emit: (eventName: string, message: unknown) => {},
                };
            },
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'deleteFirstRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresARequest').callsFake(() => false);
        const spyNewRequest = stub(service['multiplayerGameManager'], 'getNewRequest').callsFake(() => {
            return { name: 'test', id: '' };
        });
        service.handleSockets();
        expect(spyNewRequest.called).to.equal(false);
    });

    it('should join the game', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.JoinGame) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName).to.equal(SocketEvent.Play);
            },
            join: (id: string) => {},
            broadcast: {
                to: () => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.JoinGame);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'addPlayer').callsFake(() => {});
        const spyGameMode = stub(service['gameManager'], 'isClassic').callsFake(() => true);
        service.handleSockets();
        spyGameMode.callsFake(() => false);
        const expectedGameInfo = {
            id: '',
            name: 'test',
            thumbnail: '',
            differences: [],
            idEditedBmp: '',
            idOriginalBmp: '',
            multiplayerScore: [],
            soloScore: [],
        } as unknown as PrivateGameInformation;
        const gameInfo = stub(service['gameManager'], 'getGameInfo').callsFake(() => expectedGameInfo);
        service.handleSockets();
        gameInfo.callsFake(() => undefined);
        service.handleSockets();
    });

    it('should not accept if no request found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.AcceptPlayer) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(eventName).to.equal(SocketEvent.PlayerLeft);
            },
            join: (id: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => undefined);
        service.handleSockets();
    });

    it('should accept a player if a main player accepted', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.AcceptPlayer) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(
                    eventName === SocketEvent.JoinGame || eventName === SocketEvent.GetGamesWaiting || eventName === SocketEvent.RejectPlayer,
                ).to.equal(true);
            },
            join: (id: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'setTimer').callsFake(() => {});
        stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'deleteAllRequests').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'isNotAPlayersRequest').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ name: 'test', id: '0' }]);
        stub(service['multiplayerGameManager'], 'playersRequestExists').callsFake(() => true);
        service.handleSockets();
    });

    it('should accept a player if a main player accepted', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.AcceptPlayer) callback();
            },
            emit: (eventName: string, message: unknown) => {},
            join: (id: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'setTimer').callsFake(() => {});
        stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'deleteAllRequests').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'isNotAPlayersRequest').callsFake(() => false);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ name: 'test', id: '0' }]);
        stub(service['multiplayerGameManager'], 'playersRequestExists').callsFake(() => true);
        const spyEmit = stub(service['sio'].to(''), 'emit');
        service.handleSockets();
        expect(spyEmit.calledThrice).to.equal(false);
    });

    it('should disconnect a client', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Disconnect) callback();
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as unknown as io.Server;
        const spyLog = stub(console, 'log').callsFake(() => {});
        service.handleSockets();
        expect(spyLog.called).to.equal(true);
    });

    it('should create a game in solo', async () => {
        const expectedGameInfo = {
            id: '',
            name: 'test',
            thumbnail: '',
            differences: [],
            idEditedBmp: '',
            idOriginalBmp: '',
            multiplayerScore: [],
            soloScore: [],
        } as unknown as PrivateGameInformation;
        const fakeSocket = {
            join: () => {},
            emit: () => {},
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        const spySetTimer = stub(service['gameManager'], 'setTimer').callsFake(() => {});
        const spyCreateGame = stub(service['gameManager'], 'createGame').callsFake(async () => {
            return new Promise(() => '');
        });
        spyCreateGame.resolves();
        const spySendTimer = stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        const spyEmit = stub(fakeSocket, 'emit');
        const spyJoin = stub(fakeSocket, 'join');
        await service.createGameSolo('player', GameMode.Classic, { card: '', isMulti: false }, fakeSocket);
        stub(service['gameManager'], 'getGameInfo').callsFake(() => expectedGameInfo);
        expect(spySetTimer.called).to.equal(true);
        expect(spyCreateGame.called).to.equal(true);
        expect(spySendTimer.called).to.equal(true);
        expect(spyEmit.called).to.equal(true);
        expect(spyJoin.called).to.equal(true);
        await service.createGameSolo('player', GameMode.Classic, { card: '', isMulti: false }, fakeSocket);
        expect(spyEmit.calledTwice).to.equal(true);
    });

    it('should reject if the players have the same name', async () => {
        service['sio'] = {
            to: () => {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return { emit: () => {} };
            },
        } as unknown as io.Server;
        const fakeSocket = {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            join: () => {},
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            emit: () => {},
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        const spyEmit = stub(fakeSocket, 'emit');
        stub(service['gameManager'], 'hasSameName').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        const spyRoomWaiting = stub(service['multiplayerGameManager'], 'getRoomIdWaiting').callsFake(() => '');
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyAddRequest = stub(service['multiplayerGameManager'], 'addNewRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresOneRequest').callsFake(() => true);
        await service.createGameMulti('', GameMode.Classic, { card: '', isMulti: true }, fakeSocket);
        expect(spyEmit.called).to.equal(true);
        expect(spyRoomWaiting.called).to.equal(true);
        expect(spyAddRequest.called).to.equal(false);
    });

    it('should add a request to a game that is already create', async () => {
        service['sio'] = {
            to: () => {
                return { emit: () => {} };
            },
        } as unknown as io.Server;
        const fakeSocket = {
            join: () => {},
            emit: () => {},
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        const spyEmit = stub(fakeSocket, 'emit');
        stub(service['gameManager'], 'hasSameName').callsFake(() => false);
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        const spyRoomWaiting = stub(service['multiplayerGameManager'], 'getRoomIdWaiting').callsFake(() => '');
        const spyAddRequest = stub(service['multiplayerGameManager'], 'addNewRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresOneRequest').callsFake(() => true);
        await service.createGameMulti('', GameMode.Classic, { card: '', isMulti: true }, fakeSocket);
        expect(spyEmit.called).to.equal(true);
        expect(spyRoomWaiting.called).to.equal(true);
        expect(spyAddRequest.called).to.equal(true);
    });

    it('should wait a player to join a game', async () => {
        service['sio'] = {
            to: () => {
                return { emit: () => {} };
            },
        } as unknown as io.Server;
        const fakeSocket = {
            join: () => {},
            emit: () => {},
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        stub(fakeSocket, 'emit');
        stub(service['gameManager'], 'hasSameName').callsFake(() => false);
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRoomIdWaiting').callsFake(() => '');
        stub(service['multiplayerGameManager'], 'addNewRequest').callsFake(() => {});
        stub(service['multiplayerGameManager'], 'theresOneRequest').callsFake(() => false);
        await service.createGameMulti('', GameMode.Classic, { card: '', isMulti: true }, fakeSocket);
        const spyEmit = stub(service['sio'].to(''), 'emit');
        expect(spyEmit.called).to.equal(false);
    });

    it('should create a game if no game is already created', async () => {
        service['sio'] = {
            to: () => {
                return { emit: () => {} };
            },
        } as unknown as io.Server;
        const fakeSocket = {
            join: () => {},
            emit: () => {},
            broadcast: { emit: () => {} },
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        const spyEmit = stub(fakeSocket, 'emit');
        const spyJoin = stub(fakeSocket, 'join');
        const spyBroadcastEmit = stub(fakeSocket.broadcast, 'emit');
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => false);
        const spyAddGameToWaiting = stub(service['multiplayerGameManager'], 'addGameWaiting').callsFake(() => {});
        const spyCreateGame = stub(service['gameManager'], 'createGame').callsFake(async () => {
            return new Promise(() => '');
        });
        spyCreateGame.resolves();
        await service.createGameMulti('', GameMode.Classic, { card: '', isMulti: true }, fakeSocket);
        expect(spyEmit.called).to.equal(true);
        expect(spyJoin.called).to.equal(true);
        expect(spyBroadcastEmit.called).to.equal(true);
        expect(spyAddGameToWaiting.called).to.equal(true);
        expect(spyCreateGame.called).to.equal(true);
    });

    it('should create a game in limited time', async () => {
        service['sio'] = {
            to: () => {
                return { emit: () => {} };
            },
        } as unknown as io.Server;
        const fakeSocket = {
            join: () => {},
            emit: () => {},
            broadcast: {
                to: () => {
                    return { emit: () => {} };
                },
            },
        } as unknown as io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>;
        stub(fakeSocket, 'emit');
        stub(service['gameManager'], 'hasSameName').callsFake(() => false);
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['gameManager'], 'setTimer').callsFake(() => {});
        stub(service['gameManager'], 'sendTimer').callsFake(() => {});
        const spyEmit = stub(fakeSocket.broadcast.to(''), 'emit');
        const spyJoin = stub(fakeSocket, 'join');
        await service.createGameMulti('', GameMode.LimitedTime, { card: '', isMulti: true }, fakeSocket);
        expect(spyEmit.called).to.equal(false);
        expect(spyJoin.called).to.equal(true);
    });

    it('should remove game waiting if the roomId is found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: (roomId: string, gameCard: string) => void) => {
                if (eventName === SocketEvent.LeaveWaiting) callback('roomId', 'gameId');
            },
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.RejectPlayer);
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyRemoveGameWaiting = stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDeleteRequest = stub(service['multiplayerGameManager'], 'deleteRequest').callsFake(() => {});
        const spyRequest = stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ id: '1', name: 'test' }]);
        service.handleSockets();
        expect(spyRequest.called).to.equal(true);
        expect(spyDeleteRequest.called).to.equal(false);
        expect(spyRemoveGameWaiting.called).to.equal(true);
    });

    it('should not reject player if the roomId is found but no request found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: (roomId: string, gameCard: string) => void) => {
                if (eventName === SocketEvent.LeaveWaiting) callback('roomId', 'gameId');
            },
            emit: (eventName: string, message: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (id: string) => fakeSocket,
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyRemoveGameWaiting = stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDeleteRequest = stub(service['multiplayerGameManager'], 'deleteRequest').callsFake(() => {});
        const spyRequest = stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => undefined);
        const spyEmit = stub(service['sio'].to(''), 'emit');
        service.handleSockets();
        expect(spyRequest.called).to.equal(true);
        expect(spyEmit.called).to.equal(false);
        expect(spyDeleteRequest.called).to.equal(false);
        expect(spyRemoveGameWaiting.called).to.equal(true);
    });
    it('should delete request of game waiting if the roomId is not found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.LeaveWaiting) callback();
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as unknown as io.Server;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyRemoveGameWaiting = stub(service['multiplayerGameManager'], 'removeGameWaiting').callsFake(() => {});
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const spyDeleteRequest = stub(service['multiplayerGameManager'], 'deleteRequest').callsFake(() => {});
        service.handleSockets();
        expect(spyDeleteRequest.called).to.equal(true);
        expect(spyRemoveGameWaiting.called).to.equal(false);
    });

    it('should delete game if the game is waiting', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GameDeleted) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName === SocketEvent.RejectPlayer).to.equal(true);
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ id: 'playerTest' } as User]);
        service.handleSockets();
    });

    it('should not delete if the game is not waiting', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GameDeleted) callback();
            },
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;

        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => false);
        const spyGetRequest = stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ id: 'playerTest' } as User]);
        service.handleSockets();
        expect(spyGetRequest.called).to.equal(false);
    });

    it('should not reject player if the game is waiting but no request', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GameDeleted) callback();
            },
            emit: (eventName: string, message: string) => {},
        };

        service['sio'] = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;

        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => undefined);
        const spyEmit = stub(service['sio'].to(''), 'emit');
        service.handleSockets();
        expect(spyEmit.calledTwice).to.equal(false);
    });

    it('should delete all games', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GamesDeleted) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {
                expect(eventName === SocketEvent.RejectPlayer).to.equal(true);
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.RejectPlayer);
            },
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => [{ id: 'playerTest' } as User]);
        stub(service['multiplayerGameManager'], 'getGamesWaiting').callsFake(() => ['gameTestRequest']);
        stub(service['multiplayerGameManager'], 'getRoomIdWaiting').callsFake(() => 'gameTest');
        service.handleSockets();
    });

    it('should delete all games but reject no one if no request found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.GamesDeleted) callback();
            },
            // eslint-disable-next-line no-unused-vars
            emit: (eventName: string, message: string) => {},
        };

        service['sio'] = {
            sockets: fakeSocket,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            on: (eventName: string, callback: (socket: any) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.RejectPlayer);
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['multiplayerGameManager'], 'isGameWaiting').callsFake(() => true);
        stub(service['multiplayerGameManager'], 'getRequest').callsFake(() => undefined);
        const spyEmit = stub(service['sio'].to(''), 'emit');
        stub(service['multiplayerGameManager'], 'getGamesWaiting').callsFake(() => ['gameTestRequest']);
        stub(service['multiplayerGameManager'], 'getRoomIdWaiting').callsFake(() => 'gameTest');
        service.handleSockets();
        expect(spyEmit.calledTwice).to.equal(false);
    });

    it('should refresh game', () => {
        service['sio'] = {
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.RefreshGames);
            },
        } as unknown as io.Server;
        const spyEmit = stub(service['sio'], 'emit');
        service.refreshGames();
        expect(spyEmit.called).to.equal(true);
    });

    it('should fetch all not difference found', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.FetchDifferences) callback();
            },
            emit: (eventName: string, message: string) => {
                expect(eventName).to.equal(SocketEvent.FetchDifferences);
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
        } as io.Server;
        stub(service['gameManager'], 'getNbDifferenceNotFound').callsFake(() => []);
        service.handleSockets();
    });

    it('should get clues', () => {
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Clue) callback();
            },
            emit: (eventName: string, message: string) => {
                expect(eventName === SocketEvent.Clue || eventName === SocketEvent.EventMessage).to.equal(true);
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: () => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'increaseNbClueAsked').callsFake(() => []);
        stub(service['cluesService'], 'findRandomPixel').callsFake(() => {
            return { x: 0, y: 0 };
        });
        const getClues = stub(service['gameManager'], 'getNbClues').callsFake(() => 1);
        service.handleSockets();
        getClues.callsFake(() => 2);
        service.handleSockets();
        getClues.callsFake(() => 3);
        service.handleSockets();
    });

    it('should send the new game if the game is in Limited Time', () => {
        const expectedDifferenceFound = {
            coords: [],
            isPlayerFoundDifference: true,
            isGameOver: false,
            nbDifferencesLeft: 2,
        };
        const expectedGameInfo = {
            id: '',
            name: 'test',
            thumbnail: '',
            differences: [],
            idEditedBmp: '',
            idOriginalBmp: '',
            multiplayerScore: [],
            soloScore: [],
        } as unknown as PrivateGameInformation;
        const fakeSocket = {
            on: (eventName: string, callback: () => void) => {
                if (eventName === SocketEvent.Difference) callback();
            },
            emit: (eventName: string, message: unknown) => {
                expect(
                    eventName === SocketEvent.DifferenceFound || eventName === SocketEvent.EventMessage || eventName === SocketEvent.NewGameBoard,
                ).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
            to: (id: string) => {
                return { emit: (eventName: string, message: unknown) => {} };
            },
            broadcast: {
                to: () => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.DifferenceFound);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            on: (eventName: string, callback: (socket: unknown) => void) => {
                if (eventName === SocketEvent.Connection) {
                    callback(fakeSocket);
                }
            },
            to: (gameId: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['gameManager'], 'isDifference').callsFake(() => expectedDifferenceFound.coords);
        stub(service['gameManager'], 'getNbDifferencesFound').callsFake(() => expectedDifferenceFound);
        stub(service['gameManager'], 'isGameFound').callsFake(() => true);
        stub(service['gameManager'], 'isGameOver').callsFake(() => false);
        stub(service['gameManager'], 'isLimitedTime').callsFake(() => true);
        const gameInfo = stub(service['gameManager'], 'getGameInfo').callsFake(() => expectedGameInfo);
        service.handleSockets();
        service.handleSockets();
        gameInfo.callsFake(() => undefined);
        service.handleSockets();
    });

    it('should handle the end game', () => {
        const expectedGameInfo = {
            id: '',
            name: 'test',
            thumbnail: '',
            differences: [],
            idEditedBmp: '',
            idOriginalBmp: '',
            multiplayerScore: [],
            soloScore: [],
        } as unknown as PrivateGameInformation;
        const fakeSocket = {
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.EventMessage).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
            to: (id: string) => {
                return { emit: (eventName: string, message: unknown) => {} };
            },
            broadcast: {
                to: (gameId: string) => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.Lose);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            to: (gameId: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['eventMessageService'], 'sendNewHighScoreMessage').callsFake(() => '');
        const gameMulti = stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'getTime').callsFake(() => 1);
        stub(service['gameManager'], 'findPlayer').callsFake(() => '');
        stub(service['gameManager'], 'getGameInfo').callsFake(() => expectedGameInfo);
        stub(service['gameManager'], 'isGameCardDeleted').callsFake(() => false);
        const verifyScore = stub(service['scoresHandlerService'], 'verifyScore')
            .callsFake(async () => new Promise(() => 1))
            .resolves(1);
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        //  no score
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        verifyScore.callsFake(async () => new Promise(() => -1)).resolves(-1);
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        gameMulti.callsFake(() => false);
        const broadcastEvent = stub(fakeSocket.broadcast.to('gameId'), 'emit');
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        expect(broadcastEvent.called).to.equal(false);
    });
    it('should handle the end game when game card is deleted', () => {
        const expectedGameInfo = {
            id: '',
            name: 'test',
            thumbnail: '',
            differences: [],
            idEditedBmp: '',
            idOriginalBmp: '',
            multiplayerScore: [],
            soloScore: [],
        } as unknown as PrivateGameInformation;
        const fakeSocket = {
            emit: (eventName: string, message: unknown) => {
                expect(eventName === SocketEvent.Win || eventName === SocketEvent.EventMessage).to.equal(true);
            },
            join: (id: string) => {
                return;
            },
            to: (id: string) => {
                return { emit: (eventName: string, message: unknown) => {} };
            },
            broadcast: {
                to: (gameId: string) => {
                    return {
                        emit: (eventName: string, _message: unknown) => {
                            expect(eventName).to.equal(SocketEvent.Lose);
                        },
                    };
                },
            },
        };

        service['sio'] = {
            sockets: fakeSocket,
            to: (gameId: string) => fakeSocket,
        } as unknown as io.Server;
        stub(service['eventMessageService'], 'sendNewHighScoreMessage').callsFake(() => '');
        const gameMulti = stub(service['gameManager'], 'isGameMultiplayer').callsFake(() => true);
        stub(service['gameManager'], 'getTime').callsFake(() => 1);
        stub(service['gameManager'], 'findPlayer').callsFake(() => '');
        stub(service['gameManager'], 'getGameInfo').callsFake(() => expectedGameInfo);
        stub(service['gameManager'], 'isGameCardDeleted').callsFake(() => true);
        const verifyScore = stub(service['scoresHandlerService'], 'verifyScore')
            .callsFake(async () => new Promise(() => 1))
            .resolves(1);
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        //  no score
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        verifyScore.callsFake(async () => new Promise(() => -1)).resolves(-1);
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        gameMulti.callsFake(() => false);
        const broadcastEvent = stub(fakeSocket.broadcast.to('gameId'), 'emit');
        service['handleEndGame']('gameId', fakeSocket as unknown as io.Socket);
        expect(broadcastEvent.called).to.equal(false);
    });
});
