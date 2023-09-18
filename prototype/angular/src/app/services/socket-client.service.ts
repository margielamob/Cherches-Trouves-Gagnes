import { Injectable } from '@angular/core';
import { SocketEvent } from '@common/socket-event';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environment/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketClientService {
    socket: Socket = {} as Socket;

    isSocketAlive() {
        return this.socket && this.socket.connected;
    }

    connect() {
        this.socket = io(environment.socketServerUrl, { transports: ['websocket'], upgrade: false });
    }

    disconnect() {
        this.socket.send(SocketEvent.DisconnectFromChat);
        this.socket.disconnect();
    }

    on<T>(event: string, action: (data: T) => void) {
        this.socket.on(event, action);
    }

    send<T>(event: string, data?: T) {
        if (data) this.socket.emit(event, data);
        else this.socket.emit(event);
    }
}
