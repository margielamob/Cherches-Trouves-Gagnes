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
import { RouterService } from '@app/services/router-service/router.service';
import { BASE_64_HEADER } from '@common/base64';
import { Coordinate } from '@common/coordinate';
import { DifferenceFound } from '@common/difference';
import { PublicGameInformation } from '@common/game-information';
import { SocketEvent } from '@common/socket-event';

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
    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        private readonly differencesDetectionHandlerService: DifferencesDetectionHandlerService,
        private readonly gameInfoHandlerService: GameInformationHandlerService,
        private readonly communicationService: CommunicationService,
        private readonly mouseHandlerService: MouseHandlerService,
        private readonly communicationSocketService: CommunicationSocketService,
        private readonly routerService: RouterService,
        private cheatMode: CheatModeService,
        private readonly clueHandlerService: ClueHandlerService,
    ) {
        this.handleSocketDifferenceFound();
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
            await this.cheatMode.manageCheatMode(this.getContextOriginal(), this.getContextModified());
        }

        if (event.key === 'i') {
            this.clueHandlerService.getClue();
        }
    }

    ngOnInit(): void {
        this.handleClue();
    }

    ngAfterViewInit(): void {
        this.cheatMode.handleSocketEvent(this.getContextOriginal(), this.getContextModified());
        this.displayImages();
    }

    ngOnDestroy() {
        this.communicationSocketService.off(SocketEvent.DifferenceFound);
        this.communicationSocketService.off(SocketEvent.NewGameBoard);
        this.communicationSocketService.off(SocketEvent.Clue);
        this.cheatMode.removeHandleSocketEvent();
    }

    onClick($event: MouseEvent, canvas: string) {
        if (!this.isMouseDisabled()) {
            const ctx: CanvasRenderingContext2D = canvas === 'original' ? this.getContextOriginal() : this.getContextModified();
            this.mouseHandlerService.mouseHitDetect($event, ctx, this.gameInfoHandlerService.roomId);
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
        this.communicationSocketService.on(SocketEvent.NewGameBoard, (data: PublicGameInformation) => {
            this.differencesDetectionHandlerService.playCorrectSound();
            this.gameInfoHandlerService.setGameInformation(data);
            this.displayImages();
            this.gameInfoHandlerService.$newGame.next();
        });
        this.communicationSocketService.on<DifferenceFound>(SocketEvent.DifferenceFound, (data: DifferenceFound) => {
            this.differencesDetectionHandlerService.setNumberDifferencesFound(!data.isPlayerFoundDifference);
            if (this.cheatMode.isCheatModeActivated) {
                this.cheatMode.stopCheatModeDifference(this.getContextOriginal(), this.getContextModified(), data.coords);
            }
            if (this.gameInfoHandlerService.isClassic()) {
                this.differencesDetectionHandlerService.differenceDetected(this.getContextOriginal(), this.getContextImgModified(), data.coords);
                this.differencesDetectionHandlerService.differenceDetected(this.getContextModified(), this.getContextImgModified(), data.coords);
            }
        });
    }

    getContextImgOriginal() {
        return this.canvasImgOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextImgModified() {
        return this.canvasImgModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextOriginal() {
        return this.canvasOriginal.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextModified() {
        return this.canvasModified.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getContextDifferences() {
        return this.canvasImgDifference.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    getImageData(source: string) {
        return this.communicationService.getImgData(source);
    }

    displayImage(isOriginalImage: boolean, ctx: CanvasRenderingContext2D): void {
        const originalImageData = isOriginalImage
            ? this.getImageData(this.gameInfoHandlerService.getOriginalBmpId())
            : this.getImageData(this.gameInfoHandlerService.getModifiedBmpId());

        originalImageData.subscribe((response: HttpResponse<{ image: string }> | null) => {
            if (!response || !response.body) {
                return;
            }
            const imageBase64 = response.body.image;
            const image = new Image();
            image.src = BASE_64_HEADER + imageBase64;
            image.onload = () => {
                ctx.drawImage(image, 0, 0);
            };
            image.onerror = () => {
                this.routerService.navigateTo('home');
            };
        });
    }

    private displayImages() {
        this.displayImage(true, this.getContextImgModified());
        this.displayImage(false, this.getContextDifferences());
        this.displayImage(false, this.getContextImgOriginal());
    }

    private isMouseDisabled() {
        return this.differencesDetectionHandlerService.mouseIsDisabled;
    }
}
