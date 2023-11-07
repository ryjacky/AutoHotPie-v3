import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieMenuManagerComponent } from './pie-menu-manager.component';

describe('PieMenuUIComponent', () => {
  let component: PieMenuManagerComponent;
  let fixture: ComponentFixture<PieMenuManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PieMenuManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieMenuManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
