import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieMenuComponent } from './pie-menu.component';

describe('PieMenuComponent', () => {
  let component: PieMenuComponent;
  let fixture: ComponentFixture<PieMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
