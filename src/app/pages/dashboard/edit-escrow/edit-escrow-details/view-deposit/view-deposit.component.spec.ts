import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDepositComponent } from './view-deposit.component';

describe('ViewDepositComponent', () => {
  let component: ViewDepositComponent;
  let fixture: ComponentFixture<ViewDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDepositComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
