import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProductSearchRequestDto, ProductSearchResultDto } from '../models/loan-product.model';

@Injectable({
  providedIn: 'root'
})
export class LoanProduct {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/LoanProducts`;

  search(request: ProductSearchRequestDto) {
    return this.http.post<ProductSearchResultDto[]>(`${this.baseUrl}/Search`, request);
  }
}