import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffShiftFormComponent } from './staff-shift-form.component';

describe('StaffShiftFormComponent', () => {
  let component: StaffShiftFormComponent;
  let fixture: ComponentFixture<StaffShiftFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffShiftFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffShiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
