import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerVerifications } from './admin-customer-verifications';

describe('AdminCustomerVerifications', () => {
  let component: AdminCustomerVerifications;
  let fixture: ComponentFixture<AdminCustomerVerifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCustomerVerifications],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCustomerVerifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
