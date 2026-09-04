import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../environments/environment';

import {
  LoanApplicationResponseDto,
  LoanApplicationDecisionDto
} from '../models/loan-application.model';


@Injectable({
  providedIn: 'root'
})
export class AdminLoanApplication {

  private http =
    inject(HttpClient);


  private baseUrl =
    `${environment.apiUrl}/admin/loan-applications`;


  // ==========================================
  // TÜM BAŞVURULAR
  // ==========================================

  getAll() {

    return this.http.get<
      LoanApplicationResponseDto[]
    >(
      this.baseUrl
    );
  }


  // ==========================================
  // ONAYLA
  // ==========================================

  approve(
    applicationId: number,
    request: LoanApplicationDecisionDto
  ) {

    return this.http.put<
      LoanApplicationResponseDto
    >(
      `${this.baseUrl}/${applicationId}/approve`,
      request
    );
  }


  // ==========================================
  // REDDET
  // ==========================================

  reject(
    applicationId: number,
    request: LoanApplicationDecisionDto
  ) {

    return this.http.put<
      LoanApplicationResponseDto
    >(
      `${this.baseUrl}/${applicationId}/reject`,
      request
    );
  }
}