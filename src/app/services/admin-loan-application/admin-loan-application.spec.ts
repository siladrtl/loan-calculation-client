import { TestBed } from '@angular/core/testing';

import { AdminLoanApplication } from './admin-loan-application';

describe('AdminLoanApplication', () => {
  let service: AdminLoanApplication;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLoanApplication);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
