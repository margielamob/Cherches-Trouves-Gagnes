import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { DifferencesDetectionHandlerService } from '@app/services/differences-detection-handler/differences-detection-handler.service';

import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;
    let spyDifferenceDetectedHandler: jasmine.SpyObj<DifferencesDetectionHandlerService>;

    beforeEach(() => {
        spyDifferenceDetectedHandler = jasmine.createSpyObj('DifferencesDetectionHandlerService', ['getDifferenceValidation']);
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientModule, RouterTestingModule],
            providers: [{ provide: DifferencesDetectionHandlerService, useValue: spyDifferenceDetectedHandler }],
        });
        service = TestBed.inject(MouseHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
