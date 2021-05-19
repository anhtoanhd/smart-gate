import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimesSetupComponent } from './times-setup.component';

describe('TimesSetupComponent', () => {
  let component: TimesSetupComponent;
  let fixture: ComponentFixture<TimesSetupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
