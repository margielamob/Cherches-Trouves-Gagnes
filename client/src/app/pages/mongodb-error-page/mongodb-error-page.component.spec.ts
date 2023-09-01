import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MongodbErrorPageComponent } from './mongodb-error-page.component';

describe('MongodbErrorPageComponent', () => {
    let component: MongodbErrorPageComponent;
    let fixture: ComponentFixture<MongodbErrorPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MongodbErrorPageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MongodbErrorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
