import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberSliderFieldComponent } from './number-slider-field.component';

describe('NumberSliderFieldComponent', () => {
  let component: NumberSliderFieldComponent;
  let fixture: ComponentFixture<NumberSliderFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberSliderFieldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberSliderFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
