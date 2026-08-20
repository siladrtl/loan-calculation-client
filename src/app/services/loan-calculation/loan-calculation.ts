import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoanCalculationRequestDto, LoanCalculationResponseDto } from '../models/loan-calculation.model';

@Service()
export class LoanCalculation {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/LoanCalculations/calculate`;

  calculate(request: LoanCalculationRequestDto) {
    return this.http.post<LoanCalculationResponseDto>(this.baseUrl, request);
  }
}