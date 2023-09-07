import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilInformationComponent } from './user-profil-information.component';

describe('UserProfilInformationComponent', () => {
  let component: UserProfilInformationComponent;
  let fixture: ComponentFixture<UserProfilInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfilInformationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfilInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
