import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypeFilter } from './customer-type-filter';

describe('CustomerTypeFilter', () => {
  let component: CustomerTypeFilter;
  let fixture: ComponentFixture<CustomerTypeFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTypeFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerTypeFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
