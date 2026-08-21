import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { RegisterService } from '../../../services/auth/register';
import { LoginService } from '../../../services/auth/login';

import {
  CustomerType
} from '../../../services/models/customer-type.model';

@Component({
  selector: 'app-register',

  imports: [
    FormsModule
  ],

  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

  private registerService =
    inject(RegisterService);

  private loginService =
    inject(LoginService);

  private router =
    inject(Router);


  customerTypes = [
    {
      id: CustomerType.Ogrenci,
      name: 'Öğrenci'
    },
    {
      id: CustomerType.Esnaf,
      name: 'Esnaf'
    },
    {
      id: CustomerType.Emekli,
      name: 'Emekli'
    }
  ];


  firstName = '';
  lastName = '';

  birthDate = '';

  nationalId = '';

  email = '';
  phoneNumber = '';

  city = '';
  district = '';

  customerType:
    CustomerType | null = null;

  password = '';

  errorMessage = '';

  isLoading = false;


  selectCustomerType(
    type: CustomerType
  ): void {

    this.customerType = type;
  }


  register(): void {

    if (
      !this.firstName ||
      !this.lastName ||
      !this.birthDate ||
      !this.nationalId ||
      !this.email ||
      !this.phoneNumber ||
      !this.city ||
      !this.district ||
      this.customerType === null ||
      !this.password
    ) {
      return;
    }


    this.errorMessage = '';
    this.isLoading = true;


    this.registerService.register({

      firstName:
        this.firstName,

      lastName:
        this.lastName,

      birthDate:
        this.birthDate,

      nationalId:
        this.nationalId,

      email:
        this.email,

      phoneNumber:
        this.phoneNumber,

      city:
        this.city,

      district:
        this.district,

      customerType:
        this.customerType,

      password:
        this.password

    }).subscribe({

      next: (response) => {

        this.loginService.saveToken(
          response.token
        );

        this.isLoading = false;

        this.router.navigate(['/']);

      },

      error: (err) => {

        this.errorMessage =
          err.error?.message ??
          'Kayıt işlemi gerçekleştirilemedi.';

        this.isLoading = false;

      }

    });

  }


  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}