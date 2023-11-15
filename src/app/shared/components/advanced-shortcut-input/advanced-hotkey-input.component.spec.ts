import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedHotkeyInputComponent } from './advanced-hotkey-input.component';

describe('AdvancedShortcutInputComponent', () => {
  let component: AdvancedHotkeyInputComponent;
  let fixture: ComponentFixture<AdvancedHotkeyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedHotkeyInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedHotkeyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
