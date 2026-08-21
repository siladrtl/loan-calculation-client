import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { LoanProduct } from '../../services/loan-product/loan-product';

import {
  ProductSearchResultDto
} from '../../services/models/loan-product.model';

import { LoanCalculation } from '../../services/loan-calculation/loan-calculation';

import {
  LoanCalculationResponseDto
} from '../../services/models/loan-calculation.model';

import { LoanApplication } from '../../services/loan-application/loan-application';

import { LoginService } from '../../services/auth/login';

import { BankFilter } from './bank-filter/bank-filter';
import { LoanSearch } from './loan-search/loan-search';
import { LoanResults } from './loan-results/loan-results';
import { PaymentPlan } from './payment-plan/payment-plan';


interface PendingLoanApplication {
  loanProductId: number;
  loanCalculationId: number;
}


@Component({
  selector: 'app-loan-calculator',

  imports: [
    CommonModule,
    BankFilter,
    LoanSearch,
    LoanResults,
    PaymentPlan
  ],

  templateUrl: './loan-calculator.html',
  styleUrl: './loan-calculator.scss',
})
export class LoanCalculator implements OnInit {

  // ==========================================
  // SERVICES
  // ==========================================

  private loanProductService =
    inject(LoanProduct);

  private loanCalculationService =
    inject(LoanCalculation);

  private loanApplicationService =
    inject(LoanApplication);

  private loginService =
    inject(LoginService);

  private router =
    inject(Router);


  // ==========================================
  // FİLTRELER
  // ==========================================

  selectedBankIds =
    signal<Set<number>>(new Set());


  // ==========================================
  // ARAMA
  // ==========================================

  loanAmount = 0;

  maturity = 0;


  // ==========================================
  // SONUÇLAR
  // ==========================================

  results =
    signal<ProductSearchResultDto[]>([]);

  isLoading =
    signal(false);

  errorMessage =
    signal('');

  successMessage =
    signal('');


  // ==========================================
  // SEÇİLEN ÜRÜN
  // ==========================================

  selectedProduct =
    signal<ProductSearchResultDto | null>(null);


  // ==========================================
  // HESAPLAMA
  // ==========================================

  calculationResult =
    signal<LoanCalculationResponseDto | null>(null);

  isCalculating =
    signal(false);


  // ==========================================
  // ÖDEME PLANI
  // ==========================================

  isPaymentPlanOpen =
    signal(false);


  // ==========================================
  // BAŞVURU
  // ==========================================

  isApplying =
    signal(false);


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.resumePendingApplication();

  }


  // ==========================================
  // BANKA SEÇİMİ
  // ==========================================

  onBankSelectionChange(
    bankIds: number[]
  ): void {

    this.selectedBankIds.set(
      new Set(bankIds)
    );

  }


  // ==========================================
  // KREDİ ÜRÜNÜ ARA
  // ==========================================

  searchLoanProducts(
    data: {
      loanTypeId: number;
      amount: number;
      term: number;
    }
  ): void {

    if (
      data.amount <= 0 ||
      data.term <= 0
    ) {
      return;
    }


    this.loanAmount =
      data.amount;

    this.maturity =
      data.term;


    // Önceki ekran durumlarını temizle
    this.errorMessage.set('');
    this.successMessage.set('');

    this.results.set([]);

    this.selectedProduct.set(null);

    this.calculationResult.set(null);

    this.isPaymentPlanOpen.set(false);

    this.isLoading.set(true);


    const bankIds =
      Array.from(
        this.selectedBankIds()
      );


    this.loanProductService.search({

      loanTypeId:
        data.loanTypeId,

      amount:
        data.amount,

      term:
        data.term,

      bankIds:
        bankIds.length > 0
          ? bankIds
          : undefined

    }).subscribe({

      next: (products) => {

        this.results.set(
          products
        );

        this.isLoading.set(false);

      },


      error: (err) => {

        console.error(
          'Kredi ürünleri hatası:',
          err
        );

        this.errorMessage.set(
          err.error?.message ??
          'Kredi ürünleri getirilirken bir hata oluştu.'
        );

        this.isLoading.set(false);

      }

    });

  }


  // ==========================================
  // ÜRÜN SEÇ / HESAPLA
  // ==========================================

  selectProduct(
    product: ProductSearchResultDto
  ): void {

    this.selectedProduct.set(
      product
    );

    this.calculationResult.set(null);

    this.errorMessage.set('');
    this.successMessage.set('');

    this.isCalculating.set(true);


    this.loanCalculationService.calculate({

      loanProductId:
        product.loanProductId,

      amount:
        this.loanAmount,

      term:
        this.maturity

    }).subscribe({

      next: (calculation) => {

        this.calculationResult.set(
          calculation
        );

        this.isCalculating.set(false);

        this.isPaymentPlanOpen.set(true);

      },


      error: (err) => {

        console.error(
          'Hesaplama hatası:',
          err
        );

        this.errorMessage.set(
          err.error?.message ??
          'Kredi hesaplaması sırasında bir hata oluştu.'
        );

        this.isCalculating.set(false);

      }

    });

  }


  // ==========================================
  // ÖDEME PLANINI KAPAT
  // ==========================================

  closePaymentPlan(): void {

    this.isPaymentPlanOpen.set(
      false
    );

  }


  // ==========================================
  // BAŞVUR
  // ==========================================

  applyForLoan(): void {

    const product =
      this.selectedProduct();

    const calculation =
      this.calculationResult();


    if (
      !product ||
      !calculation
    ) {

      this.errorMessage.set(
        'Başvuru yapmak için önce bir kredi ürünü seçmelisiniz.'
      );

      return;
    }


    const application: PendingLoanApplication = {

      loanProductId:
        product.loanProductId,

      loanCalculationId:
        calculation.id

    };


    // ------------------------------------------
    // Kullanıcı giriş yapmamışsa
    // ------------------------------------------

    if (
      !this.loginService.isLoggedIn()
    ) {

      /*
       * Login/Register sırasında kullanıcının
       * seçtiği krediyi kaybetmemek için
       * başvuruyu geçici olarak saklıyoruz.
       */

      sessionStorage.setItem(
        'pendingLoanApplication',
        JSON.stringify(application)
      );


      this.isPaymentPlanOpen.set(
        false
      );


      this.router.navigate([
        '/login'
      ]);

      return;
    }


    // Kullanıcı giriş yaptıysa
    // doğrudan başvuruyu oluştur.
    this.createLoanApplication(
      application
    );

  }


  // ==========================================
  // BAŞVURU OLUŞTUR
  // ==========================================

  private createLoanApplication(
    application: PendingLoanApplication
  ): void {

    if (this.isApplying()) {
      return;
    }


    this.isApplying.set(true);

    this.errorMessage.set('');
    this.successMessage.set('');


    this.loanApplicationService
      .create(application)
      .subscribe({

        next: (response) => {

          console.log(
            'Başvuru başarılı:',
            response
          );


          this.isApplying.set(false);

          this.isPaymentPlanOpen.set(
            false
          );


          sessionStorage.removeItem(
            'pendingLoanApplication'
          );


          this.successMessage.set(
            'Kredi başvurunuz başarıyla oluşturuldu.'
          );

        },


        error: (err) => {

          console.error(
            'Başvuru hatası:',
            err
          );


          this.isApplying.set(false);


          // Token geçersiz / süresi dolmuş
          if (err.status === 401) {

            this.loginService.logout();


            sessionStorage.setItem(
              'pendingLoanApplication',
              JSON.stringify(application)
            );


            this.isPaymentPlanOpen.set(
              false
            );


            this.router.navigate([
              '/login'
            ]);

            return;
          }


          this.errorMessage.set(
            err.error?.message ??
            'Başvuru sırasında bir hata oluştu.'
          );

        }

      });

  }


  // ==========================================
  // LOGIN / REGISTER SONRASI
  // BEKLEYEN BAŞVURUYA DEVAM ET
  // ==========================================

  private resumePendingApplication(): void {

    if (
      !this.loginService.isLoggedIn()
    ) {
      return;
    }


    const pending =
      sessionStorage.getItem(
        'pendingLoanApplication'
      );


    if (!pending) {
      return;
    }


    try {

      const application =
        JSON.parse(
          pending
        ) as PendingLoanApplication;


      if (
        !application.loanProductId ||
        !application.loanCalculationId
      ) {

        sessionStorage.removeItem(
          'pendingLoanApplication'
        );

        return;
      }


      this.createLoanApplication(
        application
      );

    }
    catch {

      sessionStorage.removeItem(
        'pendingLoanApplication'
      );

    }

  }

}