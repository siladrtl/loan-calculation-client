import { TestBed } from '@angular/core/testing';

import { LoanProduct } from './loan-product';

describe('LoanProduct', () => {
  let service: LoanProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
