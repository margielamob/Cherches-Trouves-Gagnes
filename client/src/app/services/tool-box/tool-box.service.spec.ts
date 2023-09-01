import { TestBed } from '@angular/core/testing';
import { CanvasType } from '@app/enums/canvas-type';

import { ToolBoxService } from './tool-box.service';

describe('ToolBoxService', () => {
    let service: ToolBoxService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ToolBoxService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add CanvasType', () => {
        const spyUploadImage = spyOn(service.$uploadImage, 'set');
        service.addCanvasType(CanvasType.Left);
        expect(spyUploadImage).toHaveBeenCalled();
    });
});
