import {
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  AdminLoanApplication
} from '../../../services/admin-loan-application/admin-loan-application';

import {
  LoanApplicationResponseDto,
  LoanApplicationStatus
} from '../../../services/models/loan-application.model';


@Component({
  selector: 'app-admin-applications',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-applications.html',
  styleUrl: './admin-applications.scss'
})
export class AdminApplications implements OnInit {

  private adminLoanApplicationService =
    inject(AdminLoanApplication);


  applications =
    signal<LoanApplicationResponseDto[]>([]);


  isLoading =
    signal(false);


  errorMessage =
    signal('');


  successMessage =
    signal('');


  selectedApplicationId =
    signal<number | null>(null);


  decisionNote =
    '';


  decisionType =
    signal<'approve' | 'reject' | null>(null);


  isProcessing =
    signal(false);


  // ==========================================
  // ÖZET BİLGİLER
  // ==========================================

  totalApplications =
    computed(
      () => this.applications().length
    );


  pendingApplications =
    computed(
      () =>
        this.applications()
          .filter(
            x =>
              x.status ===
              LoanApplicationStatus.Pending
          )
          .length
    );


  approvedApplications =
    computed(
      () =>
        this.applications()
          .filter(
            x =>
              x.status ===
              LoanApplicationStatus.Approved
          )
          .length
    );


  rejectedApplications =
    computed(
      () =>
        this.applications()
          .filter(
            x =>
              x.status ===
              LoanApplicationStatus.Rejected
          )
          .length
    );


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadApplications();

  }


  // ==========================================
  // TÜM BAŞVURULARI GETİR
  // ==========================================

  loadApplications(): void {

    this.isLoading.set(true);

    this.errorMessage.set('');


    this.adminLoanApplicationService
      .getAll()
      .subscribe({

        next: (data) => {

          console.log(
            'ADMIN APPLICATIONS:',
            data
          );


          this.applications.set(
            data
          );


          this.isLoading.set(
            false
          );

        },


        error: (err) => {

          console.error(
            'Admin başvuruları yüklenemedi:',
            err
          );


          this.errorMessage.set(
            err.error?.message ??
            'Başvurular yüklenirken bir hata oluştu.'
          );


          this.isLoading.set(
            false
          );

        }

      });

  }


  // ==========================================
  // KARAR MODALINI AÇ
  // ==========================================

  openDecision(
    applicationId: number,
    type: 'approve' | 'reject'
  ): void {

    this.selectedApplicationId.set(
      applicationId
    );


    this.decisionType.set(
      type
    );


    this.decisionNote =
      '';


    this.errorMessage.set(
      ''
    );


    this.successMessage.set(
      ''
    );

  }


  // ==========================================
  // MODALI KAPAT
  // ==========================================

  closeDecision(): void {

    this.selectedApplicationId.set(
      null
    );


    this.decisionType.set(
      null
    );


    this.decisionNote =
      '';

  }


  // ==========================================
  // KARARI GÖNDER
  // ==========================================

  submitDecision(): void {

    const applicationId =
      this.selectedApplicationId();


    const type =
      this.decisionType();


    if (
      applicationId === null ||
      type === null
    ) {
      return;
    }


    this.isProcessing.set(
      true
    );


    this.errorMessage.set(
      ''
    );


    this.successMessage.set(
      ''
    );


    const request = {

      note:
        this.decisionNote.trim()
          ? this.decisionNote.trim()
          : null

    };


    const operation =
      type === 'approve'

        ? this.adminLoanApplicationService
            .approve(
              applicationId,
              request
            )

        : this.adminLoanApplicationService
            .reject(
              applicationId,
              request
            );


    operation.subscribe({

      next: () => {

        this.successMessage.set(

          type === 'approve'

            ? 'Başvuru başarıyla onaylandı.'

            : 'Başvuru başarıyla reddedildi.'

        );


        this.isProcessing.set(
          false
        );


        this.closeDecision();


        this.loadApplications();

      },


      error: (err) => {

        console.error(
          'Başvuru kararı hatası:',
          err
        );


        this.errorMessage.set(
          err.error?.message ??
          'Başvuru durumu güncellenemedi.'
        );


        this.isProcessing.set(
          false
        );

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


  // ==========================================
  // PENDING Mİ?
  // ==========================================

  isPending(
    status: LoanApplicationStatus
  ): boolean {

    return status ===
      LoanApplicationStatus.Pending;

  }

}