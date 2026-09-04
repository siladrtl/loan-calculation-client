import {
  Component,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  LoginService
} from '../../services/auth/login';

import {
  NotificationService
} from '../../services/signalr/notification';


@Component({
  selector: 'app-navbar',

  imports: [
    RouterLink
  ],

  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  private router =
    inject(Router);


  auth =
    inject(LoginService);


  private notificationService =
    inject(NotificationService);


  // ==========================================
  // LOGOUT
  // ==========================================

  async logout(): Promise<void> {

    // SignalR bağlantısını kapat
    await this.notificationService
      .stopConnection();


    // Token ve auth state temizle
    this.auth.logout();


    // Bekleyen kredi başvurusunu temizle
    sessionStorage.removeItem(
      'pendingLoanApplication'
    );


    // Ana sayfaya dön
    await this.router.navigate([
      '/'
    ]);

  }

}