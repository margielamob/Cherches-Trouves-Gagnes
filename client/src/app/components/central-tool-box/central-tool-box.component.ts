import { Component } from '@angular/core';
import { DrawService } from '@app/services/draw-service/draw-service.service';

@Component({
    selector: 'app-central-tool-box',
    templateUrl: './central-tool-box.component.html',
    styleUrls: ['./central-tool-box.component.scss'],
})
export class CentralBoxComponent {
    constructor(readonly drawService: DrawService) {}
}
