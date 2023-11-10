import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGameSelectionComponent } from './join-game-selection.component';

describe('JoinGameSelectionComponent', () => {
    let component: JoinGameSelectionComponent;
    let fixture: ComponentFixture<JoinGameSelectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [JoinGameSelectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(JoinGameSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
