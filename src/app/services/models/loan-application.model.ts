export interface CreateLoanApplicationRequestDto {
  loanProductId: number;

  loanCalculationId: number;
}

export interface LoanApplicationResponseDto {
  id: number;

  customerId: number;

  loanProductId: number;

  loanCalculationId: number;

  status: string;
}