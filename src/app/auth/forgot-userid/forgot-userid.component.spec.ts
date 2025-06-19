import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotUseridComponent } from './forgot-userid.component';

describe('ForgotUseridComponent', () => {
  let component: ForgotUseridComponent;
  let fixture: ComponentFixture<ForgotUseridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotUseridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotUseridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
