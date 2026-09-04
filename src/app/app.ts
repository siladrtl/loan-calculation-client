import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  RouterOutlet
} from '@angular/router';

import {
  Navbar
} from './components/navbar/navbar';

import {
  LoginService
} from './services/auth/login';

import {
  ApplicationStatusNotification,
  NotificationService
} from './services/signalr/notification';


@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    Navbar
  ],

  templateUrl: './app.html',

  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title =
    signal('LoanCalculator.Client');


  private loginService =
    inject(LoginService);


  private notificationService =
    inject(NotificationService);


  notificationMessage =
    signal('');


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // Önce event listener oluşturulur.
    this.listenNotifications();


    // Kullanıcı zaten customer olarak
    // giriş yapmışsa SignalR başlatılır.
    this.startSignalRIfCustomer();

  }


  // ==========================================
  // GLOBAL SIGNALR BİLDİRİMİ
  // ==========================================

  private listenNotifications(): void {

    this.notificationService
      .onApplicationStatusChanged(
        (
          notification:
            ApplicationStatusNotification
        ) => {

          console.log(
            'Global SignalR bildirimi:',
            notification
          );


          if (
            notification.status ===
            'Approved'
          ) {

            this.notificationMessage.set(
              'Kredi başvurunuz onaylandı.'
            );

          }


          else if (
            notification.status ===
            'Rejected'
          ) {

            this.notificationMessage.set(
              'Kredi başvurunuz reddedildi.'
            );

          }


          setTimeout(
            () => {

              this.notificationMessage.set(
                ''
              );

            },
            5000
          );

        }
      );

  }


  // ==========================================
  // CUSTOMER İSE CONNECTION BAŞLAT
  // ==========================================

  private startSignalRIfCustomer(): void {

    if (
      !this.loginService.isLoggedIn()
    ) {
      return;
    }


    if (
      !this.loginService.isCustomer()
    ) {
      return;
    }


    this.notificationService
      .startConnection();

  }

}