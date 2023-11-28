/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-rectangle-outline',
    templateUrl: './rectangle-outline.component.html',
    styleUrls: ['./rectangle-outline.component.scss'],
})
export class RectangleOutlineComponent {
    @Input() startX = 0;
    @Input() startY = 0;
    @Input() width = 0;
    @Input() height = 0;
    isDragging = false;
    left = 0;
    top = 0;

    onMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.startX = event.clientX - this.left;
        this.startY = event.clientY - this.top;
    }

    onMouseMove(event: MouseEvent) {
        if (this.isDragging) {
            this.left = event.clientX - this.startX;
            this.top = event.clientY - this.startY;
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }
}
