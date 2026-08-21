import { TestBed } from '@angular/core/testing';

import { LoanApplication } from './loan-application';

describe('LoanApplication', () => {
  let service: LoanApplication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanApplication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
