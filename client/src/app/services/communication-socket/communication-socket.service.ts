import { Injectable } from '@angular/core';
import { SocketEvent } from '@common/socket-event';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class CommunicationSocketService {
    socket: Socket;

    constructor() {
        if (!this.socket) {
            this.socket = io(environment.socketUrl, { transports: ['websocket'], upgrade: false });
        }
        this.connect();
    }

    private get isSocketAlive() {
        return this.socket && this.socket.connected;
    }

    disconnect() {
        if (!this.isSocketAlive) {
            return;
        }
        this.socket.disconnect();
    }

    on<T>(event: SocketEvent, action: (data: T) => void): void {
        this.socket.on(event, action);
    }

    off(event: SocketEvent) {
        this.socket.off(event);
    }

    once<T>(event: SocketEvent, action: (data: T) => void): void {
        this.socket.once(event, action);
    }

    send<T>(event: SocketEvent, data?: T) {
        if (!data) {
            this.socket.emit(event);
            return;
        }
        this.socket.emit(event, ...Object.values(data));
    }

    connect() {
        if (this.isSocketAlive) {
            return;
        }
        this.socket.connect();
    }
}
