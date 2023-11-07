import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MongodbErrorPageComponent } from './mongodb-error-page.component';

describe('MongodbErrorPageComponent', () => {
    let component: MongodbErrorPageComponent;
    let fixture: ComponentFixture<MongodbErrorPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MongodbErrorPageComponent],
            imports: [
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MongodbErrorPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
