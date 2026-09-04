import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/auth/login';
import { NotificationService } from '../../../services/signalr/notification';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private loginService = inject(LoginService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  // ==========================================
  // LOGIN
  // ==========================================
  login(): void { //sınıf içi fonksiyon, tanımı bu yüzden bu şekilde tanımlandı
    if (!this.email || !this.password) {
      this.errorMessage = 'E-posta ve şifre alanlarını doldurunuz.';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    this.loginService
      .login({ 
        email: this.email,
        password: this.password
      })
      .subscribe({
        next: (response) => {
          // ======================================
          // TOKEN KAYDET
          // ======================================
          this.loginService.saveToken(response.token);
          this.isLoading = false;

          // ======================================
          // ADMIN
          // ======================================
          if (this.loginService.isAdmin()) {
            // Admin için bekleyen müşteri başvurusu anlamlı değil
            sessionStorage.removeItem('pendingLoanApplication');
            this.router.navigate(['/admin/applications']);
            return;
          }

          // ======================================
          // CUSTOMER
          // ======================================
          if (this.loginService.isCustomer()) {
            // SignalR bağlantısını başlat
            this.notificationService.startConnection();

            // ====================================
            // BEKLEYEN KREDİ İŞLEMİ VAR MI?
            // ====================================
            const pendingApplication = sessionStorage.getItem('pendingLoanApplication');

            if (pendingApplication) {
              /*
               * Kullanıcı kredi hesaplama ekranından login'e geldiyse
               * ana sayfaya geri gönderiyoruz.
               * LoanCalculator açıldığında pendingLoanApplication bilgisini
               * okuyup ödeme planını tekrar açacak.
               */
              this.router.navigate(['/']);
              return;
            }

            // ====================================
            // NORMAL LOGIN
            // ====================================
            this.router.navigate(['/']);
            return;
          }

          // ======================================
          // ROL BULUNAMAZSA
          // ======================================
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Login hatası:', err);
          this.errorMessage = err.error?.message ?? 'E-posta veya şifre hatalı.';
          this.isLoading = false;
        }
      });
  }

  // ==========================================
  // REGISTER
  // ==========================================
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  // ==========================================
  // HOME
  // ==========================================
  goHome(): void {
    this.router.navigate(['/']);
  }
}
