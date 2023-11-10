import { TestBed } from '@angular/core/testing';

import { JoinableGameService } from './joinable-game.service';

describe('JoinableGameService', () => {
    let service: JoinableGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(JoinableGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
