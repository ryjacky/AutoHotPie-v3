import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NbIconPickerComponent } from './nb-icon-picker.component';

describe('NbIconPickerComponent', () => {
  let component: NbIconPickerComponent;
  let fixture: ComponentFixture<NbIconPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NbIconPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NbIconPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
