import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleOutlineComponent } from './rectangle-outline.component';

describe('RectangleOutlineComponent', () => {
    let component: RectangleOutlineComponent;
    let fixture: ComponentFixture<RectangleOutlineComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RectangleOutlineComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(RectangleOutlineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
