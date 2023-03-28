import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasureMethodComponent } from './measure-method.component';

describe('MeasureMethodComponent', () => {
  let component: MeasureMethodComponent;
  let fixture: ComponentFixture<MeasureMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeasureMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasureMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
