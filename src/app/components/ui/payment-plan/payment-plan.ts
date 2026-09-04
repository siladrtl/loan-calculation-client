import {
  Component,
  input,
  output
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  LoanCalculationResponseDto
} from '../../../services/models/loan-calculation.model';


@Component({
  selector: 'app-payment-plan',

  imports: [
    CommonModule
  ],

  templateUrl: './payment-plan.html',
  styleUrl: './payment-plan.scss',
})
export class PaymentPlan {

  calculationResult =
    input<LoanCalculationResponseDto | null>(
      null
    );


  bankName =
    input<string>(
      ''
    );


  // ==========================================
  // MÜŞTERİ UYGUNLUĞU
  // ==========================================

  isCustomerEligible =
    input<boolean>(
      true
    );


  eligibilityMessage =
    input<string>(
      ''
    );


  // ==========================================
  // MODAL KAPAT
  // ==========================================

  close =
    output<void>();


  // ==========================================
  // BAŞVURU
  // ==========================================

  apply =
    output<void>();

}