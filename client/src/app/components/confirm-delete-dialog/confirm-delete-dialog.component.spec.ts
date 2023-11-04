import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from '@app/services/admin-service/admin.service';

import { HttpLoaderFactory } from '@app/app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

describe('ConfirmDeleteDialogComponent', () => {
    let component: ConfirmDeleteDialogComponent;
    let fixture: ComponentFixture<ConfirmDeleteDialogComponent>;
    let spyAdminService: jasmine.SpyObj<AdminService>;

    beforeEach(async () => {
        spyAdminService = jasmine.createSpyObj('AdminService', ['deleteAllGames', 'deleteSingleGame']);
        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                AppMaterialModule,
                HttpClientModule,
                RouterTestingModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            declarations: [ConfirmDeleteDialogComponent],
            providers: [
                { provide: AdminService, useValue: spyAdminService },
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {
                        gameId: '123',
                        singleGameDelete: true,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDeleteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should delete all games', () => {
        component.deleteAllGames();
        expect(spyAdminService.deleteAllGames).toHaveBeenCalled();
    });

    it('should delete a single game', () => {
        component.deleteSingleGame();
        expect(spyAdminService.deleteSingleGame).toHaveBeenCalledWith('123');
    });
});
