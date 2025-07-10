import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEscrowComponent } from './edit-escrow.component';

describe('EditEscrowComponent', () => {
  let component: EditEscrowComponent;
  let fixture: ComponentFixture<EditEscrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEscrowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEscrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
