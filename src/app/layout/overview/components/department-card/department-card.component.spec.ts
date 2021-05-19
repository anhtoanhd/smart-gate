import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DepartmentCardComponent } from './department-card.component';

describe('DepartmentCardComponent', () => {
  let component: DepartmentCardComponent;
  let fixture: ComponentFixture<DepartmentCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
