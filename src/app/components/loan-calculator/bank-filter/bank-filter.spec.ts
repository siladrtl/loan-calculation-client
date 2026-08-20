import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankFilter } from './bank-filter';

describe('BankFilter', () => {
  let component: BankFilter;
  let fixture: ComponentFixture<BankFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(BankFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
