import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJoinGameDialogueComponent } from './create-join-game-dialogue.component';

describe('CreateJoinGameDialogueComponent', () => {
    let component: CreateJoinGameDialogueComponent;
    let fixture: ComponentFixture<CreateJoinGameDialogueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateJoinGameDialogueComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateJoinGameDialogueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
