import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCustomerVerification } from '../../../services/admin-customer-verification/admin-customer-verification';
import { CustomerVerificationDto, CustomerType, VerificationStatus } from '../../../services/models/customer-verification.model';

@Component({
  selector: 'app-admin-customer-verifications',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-customer-verifications.html',
  styleUrl: './admin-customer-verifications.scss'
})
export class AdminCustomerVerifications implements OnInit {
  private verificationService = inject(AdminCustomerVerification);

  verifications = signal<CustomerVerificationDto[]>([]);
  isLoading = signal(false);
  isProcessing = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  selectedVerificationId = signal<number | null>(null);
  decisionType = signal<'approve' | 'reject' | null>(null);
  decisionNote = '';

  totalApplications = computed(() => this.verifications().length);

  pendingApplications = computed(() =>
    this.verifications().filter(x => x.status === VerificationStatus.Pending).length
  );

  approvedApplications = computed(() =>
    this.verifications().filter(x => x.status === VerificationStatus.Approved).length
  );

  rejectedApplications = computed(() =>
    this.verifications().filter(x => x.status === VerificationStatus.Rejected).length
  );

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.verificationService.getAll().subscribe({
      next: (data) => {
        this.verifications.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Müşteri başvuruları yüklenemedi:', err);
        this.errorMessage.set(
          err.error?.message ?? 'Müşteri başvuruları yüklenirken bir hata oluştu.'
        );
        this.isLoading.set(false);
      }
    });
  }

  viewDocument(verificationId: number): void {
    this.errorMessage.set('');

    this.verificationService.getDocument(verificationId).subscribe({
      next: (blob) => {
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
      },
      error: (err) => {
        console.error('Belge görüntülenemedi:', err);
        this.errorMessage.set('Doğrulama belgesi görüntülenemedi.');
      }
    });
  }

  openDecision(verificationId: number, type: 'approve' | 'reject'): void {
    this.selectedVerificationId.set(verificationId);
    this.decisionType.set(type);
    this.decisionNote = '';
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  closeDecision(): void {
    this.selectedVerificationId.set(null);
    this.decisionType.set(null);
    this.decisionNote = '';
  }

  submitDecision(): void {
    const verificationId = this.selectedVerificationId();
    const type = this.decisionType();

    if (verificationId === null || type === null) {
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const note = this.decisionNote.trim() ? this.decisionNote.trim() : null;

    const operation = type === 'approve'
      ? this.verificationService.approve(verificationId, note)
      : this.verificationService.reject(verificationId, note);

    operation.subscribe({
      next: () => {
        this.successMessage.set(
          type === 'approve'
            ? 'Müşteri başvurusu başarıyla onaylandı.'
            : 'Müşteri başvurusu başarıyla reddedildi.'
        );
        this.isProcessing.set(false);
        this.closeDecision();
        this.loadApplications();
      },
      error: (err) => {
        console.error('Müşteri başvurusu karar hatası:', err);
        this.errorMessage.set(
          err.error?.message ?? 'Başvuru durumu güncellenemedi.'
        );
        this.isProcessing.set(false);
      }
    });
  }

  getCustomerTypeText(customerType: CustomerType): string {
    switch (customerType) {
      case CustomerType.Ogrenci:
        return 'Öğrenci';
      case CustomerType.Esnaf:
        return 'Esnaf';
      case CustomerType.Emekli:
        return 'Emekli';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusText(status: VerificationStatus): string {
    switch (status) {
      case VerificationStatus.Pending:
        return 'Bekliyor';
      case VerificationStatus.Approved:
        return 'Onaylandı';
      case VerificationStatus.Rejected:
        return 'Reddedildi';
      default:
        return 'Bilinmiyor';
    }
  }

  getStatusClass(status: VerificationStatus): string {
    switch (status) {
      case VerificationStatus.Pending:
        return 'status-pending';
      case VerificationStatus.Approved:
        return 'status-approved';
      case VerificationStatus.Rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }

  isPending(status: VerificationStatus): boolean {
    return status === VerificationStatus.Pending;
  }
}