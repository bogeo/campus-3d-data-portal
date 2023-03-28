import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointcloudsComponent } from './pointclouds.component';

describe('PointcloudsComponent', () => {
  let component: PointcloudsComponent;
  let fixture: ComponentFixture<PointcloudsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointcloudsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointcloudsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
