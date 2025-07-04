import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBasicDetailsComponent } from './view-basic-details.component';

describe('ViewBasicDetailsComponent', () => {
  let component: ViewBasicDetailsComponent;
  let fixture: ComponentFixture<ViewBasicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBasicDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBasicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
