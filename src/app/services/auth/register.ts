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

  private http =
    inject(HttpClient);

  private baseUrl =
    `${environment.apiUrl}/Auth`;


  register(
    request: RegisterRequestDto,
    verificationDocument: File
  ) {

    const formData =
      new FormData();


    formData.append(
      'FirstName',
      request.firstName
    );

    formData.append(
      'LastName',
      request.lastName
    );

    formData.append(
      'BirthDate',
      request.birthDate
    );

    formData.append(
      'NationalId',
      request.nationalId
    );

    formData.append(
      'Email',
      request.email
    );

    formData.append(
      'PhoneNumber',
      request.phoneNumber
    );

    formData.append(
      'City',
      request.city
    );

    formData.append(
      'District',
      request.district
    );

    formData.append(
      'CustomerType',
      request.customerType.toString()
    );

    formData.append(
      'Password',
      request.password
    );

    formData.append(
      'VerificationDocument',
      verificationDocument
    );


    return this.http.post<LoginResponseDto>(
      `${this.baseUrl}/register`,
      formData
    );
  }
}