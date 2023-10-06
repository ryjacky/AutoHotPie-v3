import { TestBed } from '@angular/core/testing';

import { PieMenuService } from './pie-menu.service';

describe('PieMenuStateService', () => {
  let service: PieMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PieMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
