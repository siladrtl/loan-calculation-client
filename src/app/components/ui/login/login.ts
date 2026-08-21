// components/auth/login/login.ts

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../../services/auth/login';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  private loginService = inject(LoginService);
  private router = inject(Router);

  email = '';
  password = '';

  errorMessage = '';
  isLoading = false;

  login(): void {

    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre alanlarını doldurunuz.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.loginService.login({
      email: this.email,
      password: this.password
    }).subscribe({

      next: (response) => {

        this.loginService.saveToken(response.token);

        this.isLoading = false;

        // LoanCalculator ana sayfada bekleyen başvuruyu
        // otomatik devam ettirecek.
        this.router.navigate(['/']);
      },

      error: (err) => {

        this.errorMessage =
          err.error?.message ??
          'E-posta veya şifre hatalı.';

        this.isLoading = false;
      }

    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}