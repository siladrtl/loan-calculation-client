import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  LoginRequestDto,
  LoginResponseDto
} from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private http = inject(HttpClient);

  private baseUrl =
    `${environment.apiUrl}/Auth`;

  login(request: LoginRequestDto) {
    return this.http.post<LoginResponseDto>(
      `${this.baseUrl}/login`,
      request
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(
      'token',
      token
    );
  }

  getToken(): string | null {
    return localStorage.getItem(
      'token'
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(
      'token'
    );
  }
}