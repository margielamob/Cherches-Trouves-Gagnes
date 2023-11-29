import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SIZE } from '@app/constants/canvas';
import { CheatModeService } from '@app/services/cheat-mode/cheat-mode.service';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';
import { GameInformationHandlerService } from '@app/services/game-information-handler/game-information-handler.service';
import { MouseHandlerService } from '@app/services/mouse-handler/mouse-handler.service';
import { ReplayService } from '@app/services/replay-service/replay.service';
import { RouterService } from '@app/services/router-service/router.service';
import { BASE_64_HEADER } from '@common/base64';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { PublicGameInformation } from '@common/game-information';
import { SocketEvent } from '@common/socket-event';
import * as LZString from 'lz-string';

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit, OnDestroy, OnInit {
    @Input() gameId: string;
    @ViewChild('actionsGameOriginal') private canvasOriginal: ElementRef<HTMLCanvasElement>;
    @ViewChild('actionsGameModified') private canvasModified: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgOriginal') private canvasImgOriginal: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgModified') private canvasImgModified: ElementRef<HTMLCanvasElement>;
    @ViewChild('imgModifiedWODifference') private canvasImgDifference: ElementRef<HTMLCanvasElement>;

    isThirdClue: boolean = false;
    clue: string;
    buttonPressed = '';
    intervals = [];
    counter = 0;
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly communicationService: CommunicationService,
        private readonly mouseHandlerService: MouseHandlerService,
        private communicationSocketService: CommunicationSocketService,
        private readonly routerService: RouterService,
        private cheatMode: CheatModeService,
        private readonly clueHandlerService: ClueHandlerService,
        private replayService: ReplayService,
    ) {
        this.handleSocketDifferenceFound();
        this.replayService.listenToEvents();
        this.replayService.isReplayMode = false;
        this.replayService.cheatActivated$.subscribe(async (isActive) => {
            if (isActive) {
                await this.cheatMode.manageCheatMode(this.getContextOriginal(), this.getContextModified());
                this.replayService.cheatActivated.next(false);
            }
        });
    }

    get width(): number {
        return SIZE.x;
    }

    get height(): number {
        return SIZE.y;
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
    }

    @HostListener('window:keyup', ['$event'])
    async keyBoardDetected(event: KeyboardEvent) {
        if ((event.target as HTMLElement).tagName === 'INPUT') {
            return;
        }
        if (event.key === 't') {
            this.communicationSocketService.send(SocketEvent.Cheat);
            await this.cheatMode.manageCheatMode(this.getContextOriginal(), this.getContextModified());
        }

        if (event.key === 'i') {
            this.clueHandlerService.getClue();
        }
    }

    ngOnInit() {
        this.handleClue();
        this.communicationSocketService.send(SocketEvent.GameStarted, { gameId: this.gameInfoHandlerService.roomId });
    }

    async resetCanvases(): Promise<void> {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        return new Promise((resolve) => {
            this.clearCanvases();
            this.displayImages();
            resolve();
        });
    }

    ngAfterViewInit(): void {
        this.cheatMode.handleSocketEvent(this.getContextOriginal(), this.getContextModified());
        this.displayImages();
        this.replayService.setContexts(this.getContextOriginal(), this.getContextModified(), this.getContextDifferences());
        this.replayService.setImageContexts(this.getContextImgOriginal(), this.getContextImgModified());
        this.replayService.loadImages$.subscribe(async (hasStarted) => {
            if (hasStarted) {
                await this.resetCanvases();
            }
        });
        if (this.gameInfoHandlerService.isObserver) {
            this.differencesDetectionHandlerService.mouseIsDisabled = true;
        }
    }

    ngOnDestroy() {
        this.communicationSocketService.send(SocketEvent.LeavingArena, { gameId: this.gameInfoHandlerService.roomId });
        this.communicationSocketService.off(SocketEvent.DifferenceFound);
        this.communicationSocketService.off(SocketEvent.NewGameBoard);
        this.communicationSocketService.off(SocketEvent.Clue);
        this.cheatMode.removeHandleSocketEvent();
    }

    onClick($event: MouseEvent, canvas: string) {
        if (!this.isMouseDisabled()) {
            const ctx: CanvasRenderingContext2D = canvas === 'original' ? this.getContextOriginal() : this.getContextModified();
            this.mouseHandlerService.mouseHitDetect($event, ctx, this.gameInfoHandlerService.roomId, canvas === 'original');
        }
    }

    handleClue() {
        this.communicationSocketService.on(SocketEvent.Clue, (data: { clue: Coordinate[]; nbClues: number }) => {
            if (data.nbClues === 3) {
                this.isThirdClue = true;
                this.clue = '(' + data.clue[0].x.toString() + ', ' + data.clue[0].y.toString() + ')';
                setInterval(() => {
                    this.isThirdClue = false;
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers  -- time to show third clue coordinates
                }, 5000);
                return;
            }
            this.clueHandlerService.showClue(this.getContextOriginal(), data.clue);
            this.clueHandlerService.showClue(this.getContextModified(), data.clue);
        });
    }

    handleSocketDifferenceFound() {
        this.communicationSocketService.on(SocketEvent.NewGameBoard, (obj: { gameInfo: PublicGameInformation; coords: Coordinate[][] }) => {
            this.differencesDetectionHandlerService.playCorrectSound();
            this.gameInfoHandlerService.setGameInformation(obj.gameInfo);
            this.gameInfoHandlerService.setDifferencesToClear(obj.coords);
            this.displayImages();
            this.gameInfoHandlerService.$newGame.next();
        });
        this.communicationSocketService.on(SocketEvent.OneDifference, (obj: { data: { coords: Coordinate[][]; nbDifferencesLeft: number } }) => {
            for (const coords of obj.data.coords) {
                this.differencesDetectionHandlerService.differenceDetectedLimitedTime(this.getContextImgModified(), coords);
            }
        });
        this.communicationSocketService.on(SocketEvent.DifferenceFound, (obj: { data: DifferenceFound; playerName: string }) => {
            this.differencesDetectionHandlerService.setNumberDifferencesFound(obj.playerName);
            if (this.cheatMode.isCheatModeActivated) {
                this.cheatMode.stopCheatModeDifference(this.getContextOriginal(), this.getContextModified(), obj.data.coords);
            }
            if (this.gameInfoHandlerService.isClassic()) {
                this.differencesDetectionHandlerService.differenceDetected(this.getContextOriginal(), this.getContextImgModified(), obj.data.coords);
                this.differencesDetectionHandlerService.differenceDetected(this.getContextModified(), this.getContextImgModified(), obj.data.coords);
            }
        });
    }

    getContextImgOriginal() {
        return this.canvasImgOriginal.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    getContextImgModified() {
        return this.canvasImgModified.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    getContextOriginal() {
        return this.canvasOriginal.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    getContextModified() {
        return this.canvasModified.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    getContextDifferences() {
        return this.canvasImgDifference.nativeElement.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    getImageData(source: string) {
        return this.communicationService.getImgData(source);
    }

    async displayImage(isOriginalImage: boolean, ctx: CanvasRenderingContext2D): Promise<void> {
        return new Promise((resolve, reject) => {
            this.counter++;
            const originalImageData = isOriginalImage
                ? this.getImageData(this.gameInfoHandlerService.getOriginalBmpId())
                : this.getImageData(this.gameInfoHandlerService.getModifiedBmpId());

            originalImageData.subscribe((response: HttpResponse<{ image: string }> | null) => {
                if (!response || !response.body) {
                    return;
                }
                const imageBase64 = this.decompressImage(response.body.image);
                const image = new Image();
                image.src = BASE_64_HEADER + imageBase64;
                image.onload = () => {
                    ctx.drawImage(image, 0, 0);
                    resolve();
                };
                image.onerror = () => {
                    this.routerService.navigateTo('home');
                    reject('Image load error');
                };
            });
        });
    }

    private displayImages() {
        Promise.all([
            this.displayImage(true, this.getContextImgModified()),
            this.displayImage(false, this.getContextDifferences()),
            this.displayImage(false, this.getContextImgOriginal()),
        ])
            .then(() => {
                if (this.gameInfoHandlerService.isLimitedTime()) {
                    for (const coords of this.gameInfoHandlerService.differencesToClear) {
                        this.differencesDetectionHandlerService.differenceDetectedLimitedTime(this.getContextImgModified(), coords);
                    }
                } else if (this.gameInfoHandlerService.isObserver) {
                    for (const coords of this.gameInfoHandlerService.differencesToClear) {
                        this.differencesDetectionHandlerService.differenceDetectedLimitedTime(this.getContextImgModified(), coords);
                    }
                }
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('An error occurred while displaying images:', error);
            });
    }

    private isMouseDisabled() {
        return this.differencesDetectionHandlerService.mouseIsDisabled;
    }

    private decompressImage(base64String: string) {
        return LZString.decompressFromUTF16(base64String) as string;
    }

    private clearCanvases() {
        this.getContextOriginal().clearRect(0, 0, this.canvasImgOriginal.nativeElement.width, this.canvasImgOriginal.nativeElement.height);
        this.getContextImgModified().clearRect(0, 0, this.canvasImgModified.nativeElement.width, this.canvasImgModified.nativeElement.height);
        this.getContextDifferences().clearRect(0, 0, this.canvasImgDifference.nativeElement.width, this.canvasImgDifference.nativeElement.height);
    }
}
