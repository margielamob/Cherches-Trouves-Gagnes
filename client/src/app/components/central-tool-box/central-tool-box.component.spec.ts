import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModule } from '@app/modules/material.module';

import { CentralBoxComponent } from './central-tool-box.component';

describe('CentralBoxComponent', () => {
    let component: CentralBoxComponent;
    let fixture: ComponentFixture<CentralBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CentralBoxComponent],
            imports: [AppMaterialModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CentralBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
