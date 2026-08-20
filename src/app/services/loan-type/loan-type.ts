import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoanTypeDto } from '../models/loan-type.model';

@Service()
export class LoanType {
    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/LoanTypes`;

    getAll(){
        return this.http.get<LoanTypeDto[]>(this.baseUrl);
    }
}
