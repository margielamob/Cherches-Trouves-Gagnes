import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AppMaterialModule } from '@app/modules/material.module';

import { RefreshSnackbarComponent } from './refresh-snackbar.component';

describe('RefreshSnackbarComponent', () => {
    let component: RefreshSnackbarComponent;
    let fixture: ComponentFixture<RefreshSnackbarComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RefreshSnackbarComponent],
            imports: [MatDialogModule, AppMaterialModule],
            providers: [
                { provide: MatSnackBarRef, useValue: {} },
                { provide: MAT_SNACK_BAR_DATA, useValue: {} },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(RefreshSnackbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
