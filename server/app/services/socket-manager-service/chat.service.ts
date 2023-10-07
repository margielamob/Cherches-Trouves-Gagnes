/* eslint-disable @typescript-eslint/no-explicit-any */
import { SocketEvent } from '@common/socket-event';
import * as io from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Service } from 'typedi';

@Service()
export class ChatSocketManager {
    handleSockets(socket: io.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
        socket.on(SocketEvent.Message, (message: string, roomId: string) => {
            socket.broadcast.to(roomId).emit(SocketEvent.Message, message);
        });
    }
}
