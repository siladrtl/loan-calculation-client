import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Bank } from '../models/bank.model';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  private apiUrl = 'https://localhost:7017/api/Banks';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.apiUrl);
  }
}