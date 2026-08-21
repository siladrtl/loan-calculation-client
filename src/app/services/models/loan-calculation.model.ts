export interface LoanCalculationRequestDto {
  loanProductId: number;

  amount: number;

  term: number;
}

export interface PaymentPlanItemDto {
  installmentNumber: number;

  dueDate: string;

  installmentAmount: number;

  interestAmount: number;

  kkdfAmount: number;

  bsmvAmount: number;

  principalAmount: number;

  remainingPrincipal: number;
}

export interface LoanCalculationResponseDto {
  id: number;

  amount: number;

  term: number;

  interestRate: number;

  loanProductId: number;

  loanProductName: string;

  monthlyInstallment: number;

  totalInterest: number;

  totalKkdf: number;

  totalBsmv: number;

  totalPayment: number;

  paymentPlans: PaymentPlanItemDto[];
}