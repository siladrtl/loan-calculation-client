import { CustomerType } from './customer-type.model';


// ==========================================
// KREDİ ÜRÜNÜ
// ==========================================

export interface LoanProductDto {
  id: number;

  name: string;

  interestRate: number;

  minAmount: number;
  maxAmount: number;

  minTerm: number;
  maxTerm: number;

  isActive: boolean;

  bankId: number;
  bankName: string;

  loanTypeId: number;
  loanTypeName: string;

  customerType: CustomerType;
}


// ==========================================
// ÜRÜN ARAMA REQUEST
// ==========================================

export interface ProductSearchRequestDto {
  loanTypeId: number;

  customerType?: CustomerType;

  amount: number;

  term: number;

  bankIds?: number[];
}


// ==========================================
// ÜRÜN ARAMA RESPONSE
// ==========================================

export interface ProductSearchResultDto {
  loanProductId: number;

  loanProductName: string;

  bankName: string;

  loanTypeName: string;

  customerType: CustomerType;

  amount: number;

  term: number;

  interestRate: number;

  monthlyInstallment: number;

  totalPayment: number;
}