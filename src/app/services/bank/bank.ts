import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Bank } from '../models/bank.model';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private http = inject(HttpClient);

  private baseUrl =
    `${environment.apiUrl}/Banks`;

  getAll() {
    return this.http.get<Bank[]>(
      this.baseUrl
    );
  }
} 