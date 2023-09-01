import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { DialogFormsErrorComponent } from './dialog-forms-error.component';

describe('DialogFormsErrorComponent', () => {
    let component: DialogFormsErrorComponent;
    let fixture: ComponentFixture<DialogFormsErrorComponent>;
    const model = { formTitle: 'form', errorMessages: ['test error'] };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogFormsErrorComponent],
            imports: [MatDialogModule],
            providers: [{ provide: MAT_DIALOG_DATA, useValue: model }],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogFormsErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
