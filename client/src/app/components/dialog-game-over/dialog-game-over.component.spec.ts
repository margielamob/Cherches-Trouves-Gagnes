import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { TimeFormatterService } from '@app/services/time-formatter/time-formatter.service';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { DialogGameOverComponent } from './dialog-game-over.component';

describe('DialogGameOverComponent', () => {
    let component: DialogGameOverComponent;
    let fixture: ComponentFixture<DialogGameOverComponent>;
    let spyTimeFormatter: jasmine.SpyObj<TimeFormatterService>;
    let spyDialog: jasmine.SpyObj<MatDialog>;
    // let spyUserService: jasmine.SpyObj<UserService>;

    beforeEach(async () => {
        spyTimeFormatter = jasmine.createSpyObj('TimeFormatterService', ['formatTimeForScore']);
        spyDialog = jasmine.createSpyObj('MatDialog', ['closeAll']);
    });

    it('should create', async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                AppMaterialModule,
                BrowserAnimationsModule,
                HttpClientModule,
                ReactiveFormsModule,
                AngularFireModule.initializeApp(environment.firebase),
                AngularFirestoreModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        win: true,
                        winner: 'test',
                        isClassic: true,
                        nbPoints: '0',
                        record: { index: 1, time: 0 },
                    },
                },
                {
                    provide: MatDialog,
                    useValue: spyDialog,
                },

                // {
                //     provide: UserService,
                //     useValue: spyUserService,
                // },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        expect(spyTimeFormatter.formatTimeForScore).toBeDefined();
        expect(component).toBeTruthy();
    });

    it('should be null when there is no record passed', async () => {
        await TestBed.configureTestingModule({
            declarations: [DialogGameOverComponent],
            imports: [
                AppMaterialModule,
                BrowserAnimationsModule,
                HttpClientModule,
                ReactiveFormsModule,
                AngularFireModule.initializeApp(environment.firebase),
                AngularFirestoreModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        win: true,
                        winner: 'test',
                        isClassic: true,
                        nbPoints: '0',
                        record: null,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogGameOverComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.index).toBeNull();
        expect(component.time).toBeNull();
    });

    // it('should close all dialog', async () => {
    //     await TestBed.configureTestingModule({
    //         declarations: [DialogGameOverComponent],
    //         schemas: [CUSTOM_ELEMENTS_SCHEMA],
    //         imports: [
    //             AppMaterialModule,
    //             BrowserAnimationsModule,
    //             HttpClientModule,
    //             ReactiveFormsModule,
    //             AngularFireModule.initializeApp(environment.firebase),
    //             AngularFirestoreModule,
    //             HttpClientModule,
    //             TranslateModule.forRoot({
    //                 loader: {
    //                     provide: TranslateLoader,
    //                     useFactory: HttpLoaderFactory,
    //                     deps: [HttpClient],
    //                 },
    //             }),
    //         ],
    //         providers: [
    //             {
    //                 provide: MAT_DIALOG_DATA,
    //                 useValue: {
    //                     win: true,
    //                     winner: 'test',
    //                     isClassic: true,
    //                     nbPoints: '0',
    //                     record: { index: 1, time: 0 },
    //                 },
    //             },
    //             {
    //                 provide: MatDialog,
    //                 useValue: spyDialog,
    //             },
    //         ],
    //     }).compileComponents();
    //     fixture = TestBed.createComponent(DialogGameOverComponent);
    //     component = fixture.componentInstance;
    //     fixture.detectChanges();

    //     component.quitGame();
    //     expect(spyDialog.closeAll).toHaveBeenCalled();
    // });
});
