import { TestBed } from '@angular/core/testing';

import { LoanCalculation } from './loan-calculation';

describe('LoanCalculation', () => {
  let service: LoanCalculation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanCalculation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
