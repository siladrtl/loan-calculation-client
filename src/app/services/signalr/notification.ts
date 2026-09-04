import {
  Injectable,
  inject
} from '@angular/core';

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';

import {
  environment
} from '../../../environments/environment';

import {
  LoginService
} from '../auth/login';


export interface ApplicationStatusNotification {

  applicationId: number;

  status: string;

  message: string | null;

}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private loginService =
    inject(LoginService);


  private hubConnection:
    HubConnection | null = null;


  // ==========================================
  // CONNECTION OLUŞTUR
  // ==========================================

  private createConnection(): void {

    if (this.hubConnection) {
      return;
    }


    this.hubConnection =
      new HubConnectionBuilder()

        .withUrl(
          environment.signalRUrl,
          {
            accessTokenFactory: () =>
              this.loginService.getToken() ?? ''
          }
        )

        .withAutomaticReconnect()

        .configureLogging(
          LogLevel.Information
        )

        .build();


    this.hubConnection.onreconnecting(
      error => {

        console.log(
          'SignalR yeniden bağlanıyor...',
          error
        );

      }
    );


    this.hubConnection.onreconnected(
      connectionId => {

        console.log(
          'SignalR yeniden bağlandı:',
          connectionId
        );

      }
    );


    this.hubConnection.onclose(
      error => {

        console.log(
          'SignalR bağlantısı kapandı:',
          error
        );

      }
    );

  }


  // ==========================================
  // EVENT DİNLE
  // ==========================================

  onApplicationStatusChanged(
    callback: (
      data: ApplicationStatusNotification
    ) => void
  ): void {

    // ÖNEMLİ:
    // Listener eklemeden önce connection nesnesi oluşturulur.
    this.createConnection();


    this.hubConnection?.off(
      'ApplicationStatusChanged'
    );


    this.hubConnection?.on(
      'ApplicationStatusChanged',
      callback
    );

  }


  // ==========================================
  // BAĞLANTIYI BAŞLAT
  // ==========================================

  async startConnection(): Promise<void> {

    const token =
      this.loginService.getToken();


    if (!token) {

      console.log(
        'SignalR: token bulunamadı.'
      );

      return;
    }


    this.createConnection();


    if (
      this.hubConnection?.state ===
      HubConnectionState.Connected
    ) {
      return;
    }


    if (
      this.hubConnection?.state ===
      HubConnectionState.Connecting
    ) {
      return;
    }


    try {

      await this.hubConnection?.start();


      console.log(
        'SignalR bağlantısı kuruldu.'
      );

    }
    catch (error) {

      console.error(
        'SignalR bağlantı hatası:',
        error
      );

    }

  }


  // ==========================================
  // EVENT KAPAT
  // ==========================================

  offApplicationStatusChanged(): void {

    this.hubConnection?.off(
      'ApplicationStatusChanged'
    );

  }


  // ==========================================
  // CONNECTION KAPAT
  // ==========================================

  async stopConnection(): Promise<void> {

    if (!this.hubConnection) {
      return;
    }


    if (
      this.hubConnection.state ===
      HubConnectionState.Disconnected
    ) {
      return;
    }


    try {

      await this.hubConnection.stop();


      console.log(
        'SignalR bağlantısı kapatıldı.'
      );

    }
    catch (error) {

      console.error(
        'SignalR kapatma hatası:',
        error
      );

    }

  }

}