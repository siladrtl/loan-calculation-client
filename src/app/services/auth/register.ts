import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import {
  RegisterRequestDto
} from '../models/register.model';

import {
  LoginResponseDto
} from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private http = inject(HttpClient);

  private baseUrl =
    `${environment.apiUrl}/Auth`;

  register(
    request: RegisterRequestDto
  ) {
    return this.http.post<LoginResponseDto>(
      `${this.baseUrl}/register`,
      request
    );
  }
}