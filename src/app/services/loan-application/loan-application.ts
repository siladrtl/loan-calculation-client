import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  CreateLoanApplicationRequestDto,
  LoanApplicationResponseDto
} from '../models/loan-application.model';

@Service()
export class LoanApplication {

  private http = inject(HttpClient);

  private baseUrl =
    `${environment.apiUrl}/LoanApplications`;

  create(
    request: CreateLoanApplicationRequestDto
  ) {
    return this.http.post<LoanApplicationResponseDto>(
      this.baseUrl,
      request
    );
  }
}