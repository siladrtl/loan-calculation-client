import {inject,Injectable} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../environments/environment';

import {
  CustomerVerificationDto
} from '../models/customer-verification.model';


@Injectable({
  providedIn: 'root'
})
export class AdminCustomerVerification {

  private http =
    inject(HttpClient);


  private baseUrl =
    `${environment.apiUrl}/AdminCustomerVerification`;


  // ==========================================
  // TÜM MÜŞTERİ BAŞVURULARI
  // ==========================================

  getAll() {

    return this.http.get<
      CustomerVerificationDto[]
    >(
      this.baseUrl
    );

  }


  // ==========================================
  // BELGEYİ GETİR
  // ==========================================

  getDocument(
    verificationId: number
  ) {

    return this.http.get(
      `${this.baseUrl}/${verificationId}/document`,
      {
        responseType: 'blob'
      }
    );

  }


  // ==========================================
  // ONAYLA
  // ==========================================

  approve(
    verificationId: number,
    note: string | null
  ) {

    return this.http.put<
      CustomerVerificationDto
    >(
      `${this.baseUrl}/${verificationId}/approve`,
      note
    );

  }


  // ==========================================
  // REDDET
  // ==========================================

  reject(
    verificationId: number,
    note: string | null
  ) {

    return this.http.put<
      CustomerVerificationDto
    >(
      `${this.baseUrl}/${verificationId}/reject`,
      note
    );

  }

}