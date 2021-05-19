import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AccessRoleComponent } from './access-role.component';

describe('AccessRoleComponent', () => {
  let component: AccessRoleComponent;
  let fixture: ComponentFixture<AccessRoleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
