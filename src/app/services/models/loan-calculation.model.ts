export interface LoanCalculationRequestDto {
  loanProductId: string;
  amount: number;
  term: number;
}

export interface PaymentPlanItemDto {
  installmentNumber: number;
  dueDate: string;
  installmentAmount: number;
  interestAmount: number;
  principalAmount: number;
  remainingPrincipal: number;
}

export interface LoanCalculationResponseDto {
  id: string;
  amount: number;
  term: number;
  interestRate: number;
  loanProductId: string;
  loanProductName: string;
  monthlyInstallment: number;
  totalPayment: number;
  totalInterest: number;
  paymentPlans: PaymentPlanItemDto[];
}