export enum LoanApplicationStatus {

  Pending = 1,

  Approved = 2,

  Rejected = 3

}


// ==========================================
// BAŞVURU OLUŞTURMA REQUEST
// ==========================================

export interface CreateLoanApplicationRequestDto {

  loanProductId: number;

  loanCalculationId: number;

}


// ==========================================
// BAŞVURU RESPONSE
// ==========================================

export interface LoanApplicationResponseDto {

  id: number;


  customerId: number;

  customerName: string;


  loanProductId: number;

  loanProductName: string;

  bankName: string;


  loanCalculationId: number;

  amount: number;

  term: number;

  monthlyInstallment: number;


  status: LoanApplicationStatus;


  applicationDate: string;

  decisionDate: string | null;

  decisionNote: string | null;

}


// ==========================================
// MÜŞTERİ UYGUNLUK RESPONSE
// ==========================================

export interface LoanApplicationEligibilityResponseDto {

  isEligible: boolean;

  message: string;

}


// ==========================================
// ADMIN ONAY / RED REQUEST
// ==========================================

export interface LoanApplicationDecisionDto {

  note?: string | null;

}