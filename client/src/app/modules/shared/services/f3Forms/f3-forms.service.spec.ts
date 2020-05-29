import { TestBed } from '@angular/core/testing';

import { F3FormsService } from './f3-forms.service';

describe('F3FormsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: F3FormsService = TestBed.get(F3FormsService);
    expect(service).toBeTruthy();
  });
});
