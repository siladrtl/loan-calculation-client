import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  LoanApplication
} from '../../../services/loan-application/loan-application';

import {
  LoanApplicationResponseDto,
  LoanApplicationStatus
} from '../../../services/models/loan-application.model';


@Component({
  selector: 'app-my-applications',

  imports: [
    CommonModule
  ],

  templateUrl: './my-applications.html',
  styleUrl: './my-applications.scss'
})
export class MyApplications implements OnInit {

  private loanApplicationService =
    inject(LoanApplication);


  applications =
    signal<LoanApplicationResponseDto[]>([]);


  isLoading =
    signal(false);


  errorMessage =
    signal('');


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadApplications();

  }


  // ==========================================
  // BAŞVURULARI YÜKLE
  // ==========================================

  loadApplications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.loanApplicationService
      .getMyApplications()
      .subscribe({

        next: (data) => {

          this.applications.set(data);

          this.isLoading.set(false);

        },


        error: (err) => {

          console.error(
            'Başvurular yüklenemedi:',
            err
          );


          this.errorMessage.set(
            'Başvurularınız yüklenirken bir hata oluştu.'
          );


          this.isLoading.set(false);

        }

      });

  }


  // ==========================================
  // STATUS TEXT
  // ==========================================

  getStatusText(
    status: LoanApplicationStatus
  ): string {

    switch (status) {

      case LoanApplicationStatus.Pending:
        return 'Bekliyor';

      case LoanApplicationStatus.Approved:
        return 'Onaylandı';

      case LoanApplicationStatus.Rejected:
        return 'Reddedildi';

      default:
        return 'Bilinmiyor';

    }

  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

  getStatusClass(
    status: LoanApplicationStatus
  ): string {

    switch (status) {

      case LoanApplicationStatus.Pending:
        return 'status-pending';

      case LoanApplicationStatus.Approved:
        return 'status-approved';

      case LoanApplicationStatus.Rejected:
        return 'status-rejected';

      default:
        return '';

    }

  }

}