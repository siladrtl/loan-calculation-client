import {
  Component,
  input,
  output
} from '@angular/core';

import { CommonModule } from '@angular/common';

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
    input<LoanCalculationResponseDto | null>(null);

  bankName =
    input<string>('');


  // Modal kapat
  close =
    output<void>();


  // Başvuru
  apply =
    output<void>();
}