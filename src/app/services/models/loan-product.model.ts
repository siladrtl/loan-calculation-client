export interface ProductSearchRequestDto {
  loanTypeId: string;
  customerTypeId?: string;
  amount: number;
  term: number;
  bankIds?: string[];
}

export interface ProductSearchResultDto {
  loanProductId: string;
  bankName: string;
  loanTypeName: string;
  amount: number;
  term: number;
  interestRate: number;
  monthlyInstallment: number;
  totalPayment: number;
}