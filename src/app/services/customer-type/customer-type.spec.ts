import { TestBed } from '@angular/core/testing';

import { CustomerType } from './customer-type';

describe('CustomerType', () => {
  let service: CustomerType;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerType);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
