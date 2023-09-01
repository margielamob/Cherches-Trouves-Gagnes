import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterService } from './router.service';

describe('RouterService', () => {
    let service: RouterService;
    let spyRouter: jasmine.SpyObj<Router>;

    beforeEach(() => {
        spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: Router,
                    useValue: spyRouter,
                },
            ],
        });
        service = TestBed.inject(RouterService);
        spyRouter.navigateByUrl.and.returnValue(Promise.resolve(true));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should reload the page', () => {
        service.reloadPage('test');
        expect(spyRouter.navigateByUrl).toHaveBeenCalledWith('/', { skipLocationChange: true });
    });
});
