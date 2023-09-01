import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreType } from '@common/score-type';
import { GameScoreComponent } from './game-score.component';

const SCORES = [
    {
        playerName: 'player1',
        time: 100,
        type: ScoreType.Default,
    },
    {
        playerName: 'player2',
        time: 200,
        type: ScoreType.Default,
    },
];

describe('GameScoreComponent', () => {
    let component: GameScoreComponent;
    let fixture: ComponentFixture<GameScoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameScoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GameScoreComponent);
        component = fixture.componentInstance;
        component.scores = SCORES;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should format score time', () => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        expect(component.formatScoreTime(70)).toEqual('01:10');
    });

    it('should validate the scores array', () => {
        expect(component.scores.length).toEqual(3);
        expect(component.scores[2].playerName).toEqual('joueur');
        expect(component.scores[2].type).toEqual(ScoreType.Default);
        component.scores.pop();
        component['validateScores']();
        expect(component.scores.length).toEqual(3);
    });
});
