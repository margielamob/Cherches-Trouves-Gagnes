import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSetUpGameComponent } from './dialog-set-up-game.component';

describe('DialogSetUpGameComponent', () => {
  let component: DialogSetUpGameComponent;
  let fixture: ComponentFixture<DialogSetUpGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSetUpGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSetUpGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
