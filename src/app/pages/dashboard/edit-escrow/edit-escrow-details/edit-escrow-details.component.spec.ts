import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEscrowDetailsComponent } from './edit-escrow-details.component';

describe('EditEscrowDetailsComponent', () => {
  let component: EditEscrowDetailsComponent;
  let fixture: ComponentFixture<EditEscrowDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEscrowDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEscrowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
