import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieButtonsComponent } from './pie-buttons.component';

describe('PieButtonsComponent', () => {
  let component: PieButtonsComponent;
  let fixture: ComponentFixture<PieButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
