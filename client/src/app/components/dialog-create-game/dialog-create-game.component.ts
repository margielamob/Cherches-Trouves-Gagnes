import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { Canvas } from '@app/enums/canvas';
import { Theme } from '@app/enums/theme';
import { CommunicationService } from '@app/services/communication/communication.service';

@Component({
    selector: 'app-dialog-create-game',
    templateUrl: './dialog-create-game.component.html',
    styleUrls: ['./dialog-create-game.component.scss'],
})
export class DialogCreateGameComponent implements AfterViewInit {
    @ViewChild('imageDifference', { static: false }) private differentImage!: ElementRef<HTMLCanvasElement>;
    theme: typeof Theme = Theme;
    form: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.pattern('[a-zA-Z ]*'), Validators.required, this.noWhiteSpaceValidator]),
    });

    // eslint-disable-next-line max-params -- absolutely need all the imported services
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            expansionRadius: number;
            src: ImageData;
            difference: ImageData;
            nbDifference: number;
            differenceImage: number[];
        },
        public dialog: MatDialog,
        private communication: CommunicationService,
        private router: Router,
    ) {}

    ngAfterViewInit() {
        const ctx = this.differentImage.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        ctx.putImageData(new ImageData(new Uint8ClampedArray(this.data.differenceImage), Canvas.Width, Canvas.Height, { colorSpace: 'srgb' }), 0, 0);
    }

    noWhiteSpaceValidator(control: FormControl): { [key: string]: boolean } | null {
        return !((control.value || '').trim().length === 0) ? null : { whitespace: true };
    }

    createGame() {
        this.dialog.open(LoadingScreenComponent, { disableClose: true, panelClass: 'custom-dialog-container' });
        this.communication
            .createGame(
                { original: this.data.src, modify: this.data.difference },
                this.data.expansionRadius,
                (this.form.get('name') as FormControl).value,
            )
            .subscribe((response: HttpResponse<Record<string, never>> | null) => {
                this.dialog.closeAll();
                if (!response) {
                    return;
                }
                this.router.navigate(['/admin']);
            });
    }
}
