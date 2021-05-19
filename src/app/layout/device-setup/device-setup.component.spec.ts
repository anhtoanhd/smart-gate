import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeviceSetupComponent } from './device-setup.component';

describe('DeviceSetupComponent', () => {
  let component: DeviceSetupComponent;
  let fixture: ComponentFixture<DeviceSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
