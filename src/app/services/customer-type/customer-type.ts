import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerType } from '../models/customer-type.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/CustomerTypes`;

  getAll(): Observable<CustomerType[]> {
    return this.http.get<CustomerType[]>(this.apiUrl);
  }
}