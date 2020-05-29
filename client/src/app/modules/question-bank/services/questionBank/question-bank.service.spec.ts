import { TestBed } from '@angular/core/testing';

import { QuestionBankService } from './question-bank.service';

describe('QuestionBankService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionBankService = TestBed.get(QuestionBankService);
    expect(service).toBeTruthy();
  });
});
