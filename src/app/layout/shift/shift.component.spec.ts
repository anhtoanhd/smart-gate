import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShiftComponent } from './shift.component';

describe('ShiftComponent', () => {
  let component: ShiftComponent;
  let fixture: ComponentFixture<ShiftComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
