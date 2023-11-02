import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpLoaderFactory } from '@app/app.module';
import { SocketTestHelper } from '@app/classes/socket-test-helper';
import { AppMaterialModule } from '@app/modules/material.module';
import { ClueHandlerService } from '@app/services/clue-handler-service/clue-handler.service';
import { CommunicationSocketService } from '@app/services/communication-socket/communication-socket.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { Socket } from 'socket.io-client';
import { CluesAreaComponent } from './clues-area.component';
class SocketClientServiceMock extends CommunicationSocketService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function -- connect needs to be empty (Nikolay's example)
    override connect() {}
}

describe('CluesAreaComponent', () => {
    let component: CluesAreaComponent;
    let fixture: ComponentFixture<CluesAreaComponent>;
    let socketServiceMock: SocketClientServiceMock;
    let socketHelper: SocketTestHelper;
    let spyRouter: jasmine.SpyObj<Router>;
    let spyClueHandler: jasmine.SpyObj<ClueHandlerService>;
    beforeEach(async () => {
        socketHelper = new SocketTestHelper();
        socketServiceMock = new SocketClientServiceMock();
        socketServiceMock.socket = socketHelper as unknown as Socket;
        spyRouter = jasmine.createSpyObj('Router', ['navigate']);
        spyClueHandler = jasmine.createSpyObj('ClueHandlerService', ['getClue', 'getNbCluesAsked'], { $clueAsked: new Subject<void>() });

        await TestBed.configureTestingModule({
            declarations: [CluesAreaComponent],
            imports: [
                AppMaterialModule,
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
            providers: [
                { provide: CommunicationSocketService, useValue: socketServiceMock },
                { provide: Router, useValue: spyRouter },
                { provide: ClueHandlerService, useValue: spyClueHandler },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CluesAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get clue', () => {
        component.getClue();
        expect(spyClueHandler.getClue).toHaveBeenCalled();
    });

    it('should return the clue number ', () => {
        spyClueHandler.getNbCluesAsked.and.callFake(() => {
            return 1;
        });
        component.handleClueAsked();
        spyClueHandler.$clueAsked.next();
        expect(component.clueAskedCounter).toEqual(1);
        expect(component['isDisabled']).toEqual(false);
        spyClueHandler.getNbCluesAsked.and.callFake(() => {
            return 3;
        });
        component.handleClueAsked();
        spyClueHandler.$clueAsked.next();
        expect(component.clueAskedCounter).toEqual(3);
    });
});
