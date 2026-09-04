import { inject, Injectable} from '@angular/core';

import { HttpClient
} from '@angular/common/http';

import { environment} from '../../../environments/environment';

import {
  CreateLoanApplicationRequestDto,
  LoanApplicationResponseDto,
  LoanApplicationEligibilityResponseDto
} from '../models/loan-application.model';


@Injectable({
  providedIn: 'root'
})
export class LoanApplication {

  private http =
    inject(HttpClient);


  private baseUrl =
    `${environment.apiUrl}/LoanApplications`;


  // ==========================================
  // BAŞVURU OLUŞTUR
  // ==========================================

  create(
    request: CreateLoanApplicationRequestDto
  ) {

    return this.http.post<LoanApplicationResponseDto>(
      this.baseUrl,
      request
    );

  }


  // ==========================================
  // MÜŞTERİNİN BAŞVURULARINI GETİR
  // ==========================================

  getMyApplications() {

    return this.http.get<LoanApplicationResponseDto[]>(
      `${this.baseUrl}/my-applications`
    );

  }


  // ==========================================
  // MÜŞTERİ UYGUNLUK KONTROLÜ
  // ==========================================

  checkEligibility(
    loanProductId: number
  ) {

    return this.http.get<LoanApplicationEligibilityResponseDto>(
      `${this.baseUrl}/check-eligibility/${loanProductId}`
    );

  }

}