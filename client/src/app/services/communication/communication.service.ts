import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CarouselResponse } from '@app/interfaces/carousel-response';
import { GameTimeConstants } from '@common/game-time-constants';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    deleteAllGameCards(): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/game/cards`).pipe(catchError(this.handleError<void>('deleteAllGameCards')));
    }

    deleteGame(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/game/cards/${id}`).pipe(catchError(this.handleError<void>('deleteGame')));
    }

    validateGame(original: ImageData, modify: ImageData, radius: number) {
        return this.http
            .post<{ numberDifference: number; width: number; height: number; data: number[] }>(
                `${this.baseUrl}/game/card/validation`,
                {
                    original: { width: original.width, height: original.height, data: Array.from(original.data) },
                    modify: { width: modify.width, height: modify.height, data: Array.from(modify.data) },
                    differenceRadius: radius,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    createGame(image: { original: ImageData; modify: ImageData }, radius: number, name: string) {
        return this.http
            .post<Record<string, never>>(
                `${this.baseUrl}/game/card`,
                {
                    original: { width: image.original.width, height: image.original.height, data: Array.from(image.original.data) },
                    modify: { width: image.modify.width, height: image.modify.height, data: Array.from(image.modify.data) },
                    differenceRadius: radius,
                    name,
                },
                { observe: 'response' },
            )
            .pipe(
                catchError(() => {
                    return of(null);
                }),
            );
    }

    getImgData(id: string): Observable<HttpResponse<{ image: string }>> {
        return this.http.get<{ image: string }>(`${this.baseUrl}/bmp/${id}`, { observe: 'response' }).pipe();
    }

    getGamesInfoByPage(page: number = 1): Observable<HttpResponse<CarouselResponse>> {
        return this.http.get<CarouselResponse>(`${this.baseUrl}/game/cards/?page=${page}`, { observe: 'response' }).pipe();
    }

    getGameTimeConstants(): Observable<HttpResponse<GameTimeConstants>> {
        return this.http
            .get<GameTimeConstants>(`${this.baseUrl}/game/constants`, { observe: 'response' })
            .pipe(catchError(this.handleError<HttpResponse<GameTimeConstants>>('get time constants')));
    }

    setGameTimeConstants(gameTimeConstants: GameTimeConstants): Observable<void> {
        return this.http
            .patch<void>(`${this.baseUrl}/game/constants`, gameTimeConstants)
            .pipe(catchError(this.handleError<void>('set time constants')));
    }

    refreshAllGames(): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/game/scores/reset`, {}).pipe(catchError(this.handleError<void>('refreshAllGames')));
    }

    refreshSingleGame(id: string): Observable<void> {
        return this.http.patch<void>(`${this.baseUrl}/game/scores/${id}/reset`, {}).pipe(catchError(this.handleError<void>('refreshSingleGame')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
