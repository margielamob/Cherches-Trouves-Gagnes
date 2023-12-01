// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { AngularFireModule } from '@angular/fire/compat';
// import { MatIconModule } from '@angular/material/icon';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { RouterTestingModule } from '@angular/router/testing';
// import { HttpLoaderFactory } from '@app/app.module';
// import { ExitGameButtonComponent } from '@app/components/exit-game-button/exit-game-button.component';
// import { AuthenticationService } from '@app/services/authentication-service/authentication.service';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
// import { environment } from 'src/environments/environment';
// import { PageHeaderComponent } from './page-header.component';
// describe('PageHeaderComponent', () => {
//     let component: PageHeaderComponent;
//     let fixture: ComponentFixture<PageHeaderComponent>;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             declarations: [PageHeaderComponent, ExitGameButtonComponent],
//             imports: [
//                 MatToolbarModule,
//                 MatIconModule,
//                 AngularFireModule.initializeApp(environment.firebase),
//                 HttpClientModule,
//                 RouterTestingModule,
//                 TranslateModule.forRoot({
//                     loader: {
//                         provide: TranslateLoader,
//                         useFactory: HttpLoaderFactory,
//                         deps: [HttpClient],
//                     },
//                 }),
//             ],
//             providers: [AuthenticationService],
//         }).compileComponents();

//         fixture = TestBed.createComponent(PageHeaderComponent);
//         component = fixture.componentInstance;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
// });
