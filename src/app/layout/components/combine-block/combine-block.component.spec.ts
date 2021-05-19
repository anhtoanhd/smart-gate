import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CombineBlockComponent } from './combine-block.component';

describe('CombineBlockComponent', () => {
  let component: CombineBlockComponent;
  let fixture: ComponentFixture<CombineBlockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CombineBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombineBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
