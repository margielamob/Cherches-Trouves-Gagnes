import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CREATE_GAME, DELETE_GAMES, VALID_GAME } from '@app/constants/server';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { CommunicationService } from '@app/services/communication/communication.service';
import { GameTimeConstants } from '@common/game-time-constants';

describe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        baseUrl = service['baseUrl'];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get image data when game card is loaded', () => {
        service.getImgData('original').subscribe({
            next: (response: HttpResponse<{ image: string }>) => {
                expect(response.body).toEqual({ image: '' });
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/bmp/original`);
        expect(req.request.method).toBe('GET');
    });

    it('should send a request to validate a game', () => {
        service
            .validateGame(
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                0,
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(VALID_GAME);
        expect(req.request.method).toBe('POST');
        req.flush({
            original: { width: 0, height: 0, data: Array.from([]) },
            modify: { width: 0, height: 0, data: Array.from([]) },
            differenceRadius: 0,
        });
    });

    it('should handle http error when validate a game', () => {
        service
            .validateGame(
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                0,
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(VALID_GAME);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should send a request to create a game', () => {
        service
            .createGame(
                {
                    original: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                    modify: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                },
                3,
                '',
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: () => {},
                error: fail,
            });
        const req = httpMock.expectOne(`${baseUrl}/game/card`);
        expect(req.request.method).toBe('POST');
        req.flush({
            original: { width: 0, height: 0, data: Array.from([]) },
            modify: { width: 0, height: 0, data: Array.from([]) },
            differenceRadius: 0,
            name: '',
        });
    });

    it('should handle http error when create a game', () => {
        service
            .createGame(
                {
                    original: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                    modify: { width: 0, height: 0, data: new Uint8ClampedArray() } as ImageData,
                },
                3,
                '',
            )
            .subscribe({
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
                next: (response) => {
                    expect(response).toBeNull();
                },
            });
        const req = httpMock.expectOne(CREATE_GAME);
        expect(req.request.method).toBe('POST');
        req.error(new ProgressEvent('Random error occurred'));
    });

    it('should handle delete all game cards', () => {
        service.deleteAllGameCards().subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(DELETE_GAMES);
        expect(req.request.method).toBe('DELETE');
    });

    it('should delete a game by id', () => {
        service.deleteGame('gameid').subscribe({
            // eslint-disable-next-line @typescript-eslint/no-empty-function -- calls fake next and return {}
            next: () => {},
            error: fail,
        });
        const req = httpMock.expectOne(DELETE_GAMES + '/gameid');
        expect(req.request.method).toBe('DELETE');
    });

    it('should get cards by page number', () => {
        service.getGamesInfoByPage().subscribe({
            next: (response: HttpResponse<CarouselResponse>) => {
                expect(response.body).toEqual({} as CarouselResponse);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/cards/?page=1`);
        expect(req.request.method).toBe('GET');
    });

    it('should get the game time constants', () => {
        service.getGameTimeConstants().subscribe({
            next: (response: HttpResponse<GameTimeConstants>) => {
                expect(response.body).toEqual({} as GameTimeConstants);
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/constants`);
        expect(req.request.method).toBe('GET');
    });

    it('should set the game time constants', () => {
        service.setGameTimeConstants({} as GameTimeConstants).subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/constants`);
        expect(req.request.method).toBe('PATCH');
    });

    it('should handle error when set game time constant', () => {
        service.setGameTimeConstants({} as GameTimeConstants).subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/constants`);
        expect(req.request.method).toBe('PATCH');
        req.error(new ProgressEvent('Random error has occur'));
    });

    it('should refresh all the scores for each game', () => {
        service.refreshAllGames().subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/scores/reset`);
        expect(req.request.method).toBe('PATCH');
    });

    it('should reset the scores for a single game', () => {
        service.refreshSingleGame('1').subscribe({
            next: (response: void) => {
                expect(response).toBeUndefined();
            },
            error: fail,
        });

        const req = httpMock.expectOne(`${baseUrl}/game/scores/1/reset`);
        expect(req.request.method).toBe('PATCH');
    });
});
