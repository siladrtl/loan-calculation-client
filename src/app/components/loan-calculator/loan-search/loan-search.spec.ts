import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSearch } from './loan-search';

describe('LoanSearch', () => {
  let component: LoanSearch;
  let fixture: ComponentFixture<LoanSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
