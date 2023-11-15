import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedShortcutInputComponent } from './advanced-shortcut-input.component';

describe('AdvancedShortcutInputComponent', () => {
  let component: AdvancedShortcutInputComponent;
  let fixture: ComponentFixture<AdvancedShortcutInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedShortcutInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedShortcutInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
