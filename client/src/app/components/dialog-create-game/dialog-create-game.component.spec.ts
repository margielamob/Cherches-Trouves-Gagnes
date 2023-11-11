import { HttpClient, HttpClientModule, HttpResponse } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpLoaderFactory } from '@app/app.module';
import { LoadingScreenComponent } from '@app/components/loading-screen/loading-screen.component';
import { Canvas } from '@app/enums/canvas';
import { AppMaterialModule } from '@app/modules/material.module';
import { CommunicationService } from '@app/services/communication/communication.service';
import { UserService } from '@app/services/user-service/user.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogCreateGameComponent } from './dialog-create-game.component';

describe('DialogCreateGameComponent', () => {
    let component: DialogCreateGameComponent;
    let fixture: ComponentFixture<DialogCreateGameComponent>;
    let spyCommunicationService: jasmine.SpyObj<CommunicationService>;
    let spyRouter: jasmine.SpyObj<Router>;
    const image = new ImageData(Canvas.Width, Canvas.Height);
    const pixelLength = 4;
    const model = {
        expansionRadius: 0,
        nbDifference: 0,
        differenceImage: new Array(pixelLength * Canvas.Width * Canvas.Height).fill(0),
        src: image,
        difference: image,
    };
    beforeEach(async () => {
        spyCommunicationService = jasmine.createSpyObj('CommunicationService', ['createGame']);
        spyRouter = jasmine.createSpyObj('RouterService', ['navigate']);
        await TestBed.configureTestingModule({
            declarations: [DialogCreateGameComponent, LoadingScreenComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: model },
                { provide: CommunicationService, useValue: spyCommunicationService },
                { provide: Router, useValue: spyRouter },
                UserService,
            ],
            imports: [
                AppMaterialModule,
                BrowserAnimationsModule,
                HttpClientModule,
                FormsModule,
                ReactiveFormsModule,
                HttpClientModule,
                AngularFireModule.initializeApp(environment.firebase),

                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DialogCreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should verify if the game name is valid', () => {
        const form = { value: 'a    ' } as FormControl;
        expect(component.noWhiteSpaceValidator(form)).toEqual(null);
    });

    it('should verify if the game name is valid', () => {
        const form = { value: '' } as FormControl;
        expect(component.noWhiteSpaceValidator(form)).toEqual({ whitespace: true });
    });

    it('should post the game', () => {
        spyCommunicationService.createGame.and.callFake(() => {
            return of({} as HttpResponse<Record<string, never>>);
        });
        component.createGame();
        expect(spyRouter.navigate).toHaveBeenCalled();
        expect(spyCommunicationService.createGame).toHaveBeenCalled();

        spyCommunicationService.createGame.and.callFake(() => {
            return of(null);
        });
        component.createGame();
        expect(spyCommunicationService.createGame).toHaveBeenCalled();
    });
});
