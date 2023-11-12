import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectExeDialogComponent } from './select-exe-dialog.component';

describe('NewProfileDialogComponent', () => {
  let component: SelectExeDialogComponent;
  let fixture: ComponentFixture<SelectExeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectExeDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectExeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
