import { TestBed } from '@angular/core/testing';

import { LoanType } from './loan-type';

describe('LoanType', () => {
  let service: LoanType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
