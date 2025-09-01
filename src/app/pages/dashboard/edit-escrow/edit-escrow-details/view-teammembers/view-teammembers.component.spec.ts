import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeammembersComponent } from './view-teammembers.component';

describe('ViewTeammembersComponent', () => {
  let component: ViewTeammembersComponent;
  let fixture: ComponentFixture<ViewTeammembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTeammembersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTeammembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
