import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-game-constant-field',
    templateUrl: './game-constant-field.component.html',
    styleUrls: ['./game-constant-field.component.scss'],
})
export class GameConstantFieldComponent {
    @Input() value: number;
    @Output() valueChange = new EventEmitter<number>();
    @Input() label: string;
    @Input() min: number;
    @Input() max: number;
    @Input() step: number;

    togglePlus(): void {
        if (this.value < this.max) {
            this.value += this.step;
            this.valueChange.emit(this.value);
        }
    }

    toggleMinus(): void {
        if (this.value > this.min) {
            this.value -= this.step;
            this.valueChange.emit(this.value);
        }
    }

    isAtMin(): boolean {
        return this.value === this.min;
    }

    isAtMax(): boolean {
        return this.value === this.max;
    }
}
