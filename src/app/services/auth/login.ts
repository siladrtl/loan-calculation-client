import {
  Injectable,
  inject,
  signal
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../environments/environment';

import {
  LoginRequestDto,
  LoginResponseDto
} from '../models/login.model';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http =
    inject(HttpClient);


  private baseUrl =
    `${environment.apiUrl}/Auth`;


  // ==========================================
  // AUTH STATE
  // ==========================================

  token =
    signal<string | null>(
      sessionStorage.getItem('token')
    );


  role =
    signal<string | null>(
      null
    );


  email =
    signal<string | null>(
      null
    );


  firstName =
    signal<string | null>(
      null
    );


  lastName =
    signal<string | null>(
      null
    );


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    const existingToken =
      sessionStorage.getItem(
        'token'
      );


    if (existingToken) {

      this.setUserInformation(
        existingToken
      );

    }

  }


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    request: LoginRequestDto
  ) {

    return this.http.post<LoginResponseDto>(
      `${this.baseUrl}/login`,
      request
    );

  }


  // ==========================================
  // TOKEN KAYDET
  // ==========================================

  saveToken(
    token: string
  ): void {

    sessionStorage.setItem(
      'token',
      token
    );


    this.token.set(
      token
    );


    this.setUserInformation(
      token
    );

  }


  // ==========================================
  // TOKEN GETİR
  // ==========================================

  getToken(): string | null {

    return this.token();

  }


  // ==========================================
  // LOGIN KONTROLÜ
  // ==========================================

  isLoggedIn(): boolean {

    return this.token() !== null;

  }


  // ==========================================
  // ROLE
  // ==========================================

  getRole(): string | null {

    return this.role();

  }


  isAdmin(): boolean {

    return this.role() === 'Admin';

  }


  isCustomer(): boolean {

    return this.role() === 'Customer';

  }


  // ==========================================
  // EMAIL
  // ==========================================

  getEmail(): string | null {

    return this.email();

  }


  // ==========================================
  // AD
  // ==========================================

  getFirstName(): string | null {

    return this.firstName();

  }


  // ==========================================
  // SOYAD
  // ==========================================

  getLastName(): string | null {

    return this.lastName();

  }


  // ==========================================
  // AD SOYAD
  // ==========================================

  getFullName(): string {

    const firstName =
      this.firstName();

    const lastName =
      this.lastName();


    return [
      firstName,
      lastName
    ]
      .filter(Boolean)
      .join(' ');

  }


  // ==========================================
  // JWT OKU
  // ==========================================

  private setUserInformation(
    token: string
  ): void {

    try {

      const payloadPart =
        token.split('.')[1];


      if (!payloadPart) {

        this.clearAuthState();

        return;

      }


      // Base64Url -> Base64
      let base64 =
        payloadPart
          .replace(/-/g, '+')
          .replace(/_/g, '/');


      // Base64 padding
      while (
        base64.length % 4
      ) {

        base64 += '=';

      }


      // ======================================
      // BASE64 DECODE
      // ======================================

      const binaryString =
        atob(base64);


      // ======================================
      // UTF-8 DECODE
      // Türkçe karakterlerin düzgün okunması
      // için byte dizisine dönüştürülür.
      // ======================================

      const bytes =
        Uint8Array.from(
          binaryString,
          char => char.charCodeAt(0)
        );


      const decodedPayload =
        new TextDecoder('utf-8')
          .decode(bytes);


      const payload =
        JSON.parse(
          decodedPayload
        );


      // ======================================
      // CLAIM İSİMLERİ
      // ======================================

      const roleClaim =
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';


      const emailClaim =
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress';


      // ======================================
      // ROLE
      // ======================================

      this.role.set(
        payload[roleClaim] ??
        null
      );


      // ======================================
      // EMAIL
      // ======================================

      this.email.set(
        payload[emailClaim] ??
        null
      );


      // ======================================
      // AD
      // ======================================

      this.firstName.set(
        payload['FirstName'] ??
        null
      );


      // ======================================
      // SOYAD
      // ======================================

      this.lastName.set(
        payload['LastName'] ??
        null
      );

    }
    catch (error) {

      console.error(
        'JWT okunamadı:',
        error
      );


      this.clearAuthState();

    }

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    sessionStorage.removeItem(
      'token'
    );


    this.clearAuthState();

  }


  // ==========================================
  // STATE TEMİZLE
  // ==========================================

  private clearAuthState(): void {

    this.token.set(
      null
    );


    this.role.set(
      null
    );


    this.email.set(
      null
    );


    this.firstName.set(
      null
    );


    this.lastName.set(
      null
    );

  }

}