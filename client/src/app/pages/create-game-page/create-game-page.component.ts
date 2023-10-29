import { HttpResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogCreateGameComponent } from '@app/components/dialog-create-game/dialog-create-game.component';
import { DialogFormsErrorComponent } from '@app/components/dialog-forms-error/dialog-forms-error.component';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { Canvas } from '@app/enums/canvas';
import { CanvasType } from '@app/enums/canvas-type';
import { Theme } from '@app/enums/theme';
import { CanvasEventHandlerService } from '@app/services/canvas-event-handler/canvas-event-handler.service';
import { CommunicationService } from '@app/services/communication/communication.service';
import { DrawService } from '@app/services/draw-service/draw-service.service';
import { ExitButtonHandlerService } from '@app/services/exit-button-handler/exit-button-handler.service';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-create-game-page',
    templateUrl: './create-game-page.component.html',
    styleUrls: ['./create-game-page.component.scss'],
})
export class CreateGamePageComponent {
    form: FormGroup;
    theme: typeof Theme = Theme;
    drawingImage: Map<CanvasType, ImageData> = new Map();
    canvasType: typeof CanvasType = CanvasType;
    lang = this.translateService.currentLang;
    // eslint-disable-next-line max-params
    constructor(
        public dialog: MatDialog,
        private drawService: DrawService,
        private communication: CommunicationService,
        private canvasEventHandler: CanvasEventHandlerService,
        exitButtonService: ExitButtonHandlerService,
        private translateService: TranslateService,
    ) {
        this.drawService.initialize();
        this.drawingImage.set(CanvasType.Left, new ImageData(Canvas.Width, Canvas.Height));
        this.drawingImage.set(CanvasType.Right, new ImageData(Canvas.Width, Canvas.Height));
        this.drawService.addDrawingCanvas(CanvasType.Left);
        this.drawService.addDrawingCanvas(CanvasType.Right);

        exitButtonService.setCreateGamePage();
        this.form = new FormGroup({
            expansionRadius: new FormControl(3, Validators.required),
        });
        this.drawService.$drawingImage.forEach((event: Subject<ImageData>, canvasType: CanvasType) => {
            event.subscribe((newImage: ImageData) => {
                this.drawingImage.set(canvasType, newImage);
            });
        });
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
        if (!event.ctrlKey) {
            return;
        }
        if (event.key !== 'z' && event.key !== 'Z') {
            return;
        }
        if (event.shiftKey) {
            this.canvasEventHandler.handleCtrlShiftZ();
        } else {
            this.canvasEventHandler.handleCtrlZ();
        }
    }

    manageErrorInForm(validationImageErrors: string) {
        const title = this.lang === 'Fr' ? "Message d'erreur" : 'Error message';

        this.dialog.open(DialogFormsErrorComponent, {
            data: { formTitle: title, errorMessages: [validationImageErrors] },
        });
    }

    validateForm(nbDifference: number, differenceImage: number[]) {
        this.dialog.open(DialogCreateGameComponent, {
            data: {
                expansionRadius: parseInt((this.form.get('expansionRadius') as FormControl).value, 10),
                src: this.drawingImage.get(CanvasType.Right),
                difference: this.drawingImage.get(CanvasType.Left),
                nbDifference,
                differenceImage,
            },
        });
    }

    isGameValid() {
        const errorMessage = this.lang === 'Fr' ? 'Il faut entre 3 et 9 differences' : 'You need between 3 and 9 differences';

        // Utilisez la traduction dans votre fonction
        this.dialog.open(LoadingScreenComponent, { panelClass: 'custom-dialog-container' });
        return this.communication
            .validateGame(
                this.drawingImage.get(CanvasType.Right) as ImageData,
                this.drawingImage.get(CanvasType.Left) as ImageData,
                parseInt((this.form.get('expansionRadius') as FormControl).value, 10),
            )
            .subscribe((response: HttpResponse<{ numberDifference: number; width: number; height: number; data: number[] }> | null) => {
                this.dialog.closeAll();
                if (!response || !response.body) {
                    this.manageErrorInForm(errorMessage);
                    return;
                }
                this.validateForm(response.body.numberDifference as number, response.body.data);
            });
    }
}
