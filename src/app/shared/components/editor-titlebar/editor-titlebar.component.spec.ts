import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTitlebarComponent } from './editor-titlebar.component';

describe('EditorTitlebarComponent', () => {
  let component: EditorTitlebarComponent;
  let fixture: ComponentFixture<EditorTitlebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorTitlebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTitlebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
