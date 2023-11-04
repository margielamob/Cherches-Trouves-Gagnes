import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { HttpLoaderFactory } from '@app/app.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AdminService } from '@app/services/admin-service/admin.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AdminCommandsComponent } from './admin-commands.component';

describe('AdminCommandsComponent', () => {
    let component: AdminCommandsComponent;
    let fixture: ComponentFixture<AdminCommandsComponent>;
    let spyAdminService: jasmine.SpyObj<AdminService>;
    let spyDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        spyAdminService = jasmine.createSpyObj('AdminService', [
            'openSettings',
            'deleteAllGames',
            'resetAllHighScores',
            'hasCards',
            'refreshAllGames',
        ]);
        spyDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            imports: [
                AppMaterialModule,
                HttpClientModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            declarations: [AdminCommandsComponent],
            providers: [
                {
                    provide: AdminService,
                    useValue: spyAdminService,
                },
                {
                    provide: MatDialog,
                    useValue: spyDialog,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminCommandsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('hasCards should call hasCards from adminService', () => {
        component.hasCards();
        expect(spyAdminService.hasCards).toHaveBeenCalled();
    });

    it('onClickModifySettings should call openSettings from adminService', () => {
        component.onClickModifySettings();
        expect(spyAdminService.openSettings).toHaveBeenCalled();
    });

    it('onClickDeleteGames should validate that the user really wants to delete', () => {
        component.onClickDeleteGames();
        expect(spyDialog.open).toHaveBeenCalled();
    });

    it('onClickRefreshGames should call refreshAllGames from admin service', () => {
        component.onClickRefreshGames();
        expect(spyAdminService.refreshAllGames).toHaveBeenCalled();
    });
});
