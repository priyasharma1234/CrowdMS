import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReleaseRequestComponent } from './add-release-request.component';

describe('AddReleaseRequestComponent', () => {
  let component: AddReleaseRequestComponent;
  let fixture: ComponentFixture<AddReleaseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReleaseRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReleaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
