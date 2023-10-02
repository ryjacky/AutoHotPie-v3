import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieGuidingLineComponent } from './pie-guiding-line.component';

describe('PieGuidingLineComponent', () => {
  let component: PieGuidingLineComponent;
  let fixture: ComponentFixture<PieGuidingLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieGuidingLineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieGuidingLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
