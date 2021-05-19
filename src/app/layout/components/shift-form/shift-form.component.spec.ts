import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShiftFormComponent } from './shift-form.component';

describe('ShiftFormComponent', () => {
  let component: ShiftFormComponent;
  let fixture: ComponentFixture<ShiftFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
