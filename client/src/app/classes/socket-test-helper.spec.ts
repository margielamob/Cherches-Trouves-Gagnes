import { TestBed } from '@angular/core/testing';
import { SocketTestHelper } from './socket-test-helper';

describe('SocketTestHelper', () => {
    let socketTestHelper: SocketTestHelper;

    beforeEach(() => {
        socketTestHelper = TestBed.inject(SocketTestHelper);
    });

    it('should be created', () => {
        expect(socketTestHelper).toBeTruthy();
    });

    it('should return undefined on emit', () => {
        expect(socketTestHelper.emit()).toBeUndefined();
    });

    it('should return undefined on disconnect', () => {
        expect(socketTestHelper.disconnect()).toBeUndefined();
    });

    it('should return undefined on peerSideEmit if no event', () => {
        expect(socketTestHelper.peerSideEmit('')).toBeUndefined();
    });
});
