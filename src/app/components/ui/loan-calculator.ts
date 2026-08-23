import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild
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

import {
  BankFilter,
  SelectedBank
} from './bank-filter/bank-filter';

import { LoanSearch } from './loan-search/loan-search';
import { LoanResults } from './loan-results/loan-results';
import { PaymentPlan } from './payment-plan/payment-plan';


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
export class LoanCalculator {

  private loanProductService =
    inject(LoanProduct);

  private loanCalculationService =
    inject(LoanCalculation);

  private loanApplicationService =
    inject(LoanApplication);

  private router =
    inject(Router);


  // ==========================================
  // SCROLL ALANLARI
  // ==========================================

  resultsSection =
    viewChild<ElementRef<HTMLElement>>(
      'resultsSection'
    );

  emptyResultSection =
    viewChild<ElementRef<HTMLElement>>(
      'emptyResultSection'
    );


  // ==========================================
  // BANKALAR
  // ==========================================

  selectedBanks =
    signal<SelectedBank[]>([]);

  missingBanks =
    signal<SelectedBank[]>([]);


  private missingBankToastTimer:
    ReturnType<typeof setTimeout> | null = null;


  // ==========================================
  // SON ARAMA
  // ==========================================

  lastSearch =
    signal<{
      loanTypeId: number;
      amount: number;
      term: number;
    } | null>(null);


  // ==========================================
  // ARAMA DURUMU
  // ==========================================

  hasSearched =
    signal(false);

  loanAmount = 0;

  maturity = 12;


  // ==========================================
  // SONUÇLAR
  // ==========================================

  results =
    signal<ProductSearchResultDto[]>([]);

  isLoading =
    signal(false);

  errorMessage =
    signal('');


  // ==========================================
  // SEÇİLEN ÜRÜN
  // ==========================================

  selectedProduct =
    signal<ProductSearchResultDto | null>(
      null
    );


  // ==========================================
  // HESAPLAMA
  // ==========================================

  calculationResult =
    signal<LoanCalculationResponseDto | null>(
      null
    );

  isCalculating =
    signal(false);


  // ==========================================
  // MODAL
  // ==========================================

  isPaymentPlanOpen =
    signal(false);


  // ==========================================
  // BANKA SEÇİMİ
  // ==========================================

  onBankSelectionChange(
    banks: SelectedBank[]
  ): void {

    this.selectedBanks.set(
      banks
    );


    const lastSearch =
      this.lastSearch();


    // İlk arama henüz yapılmadıysa
    // sadece seçimi kaydet
    if (!lastSearch) {
      return;
    }


    // Daha önce arama yapıldıysa
    // banka filtresi dinamik çalışsın
    // ve güncellenen sonuç alanına kaydırsın
    this.searchLoanProducts(
      lastSearch,
      true
    );

  }


  // ==========================================
  // KREDİ ÜRÜNLERİNİ ARA
  // ==========================================

  searchLoanProducts(
    data: {
      loanTypeId: number;
      amount: number;
      term: number;
    },

    scrollToResults: boolean = true

  ): void {

    if (!data.loanTypeId) {

      this.errorMessage.set(
        'Lütfen bir kredi türü seçiniz.'
      );

      return;
    }


    if (data.amount <= 0) {

      this.errorMessage.set(
        'Lütfen geçerli bir kredi tutarı giriniz.'
      );

      return;
    }


    if (data.term <= 0) {

      this.errorMessage.set(
        'Lütfen geçerli bir vade giriniz.'
      );

      return;
    }


    // ==========================================
    // SON ARAMA
    // ==========================================

    this.lastSearch.set({

      loanTypeId:
        data.loanTypeId,

      amount:
        data.amount,

      term:
        data.term

    });


    this.loanAmount =
      data.amount;

    this.maturity =
      data.term;


    // ==========================================
    // DURUM TEMİZLE
    // ==========================================

    this.hasSearched.set(
      true
    );

    this.isLoading.set(
      true
    );

    this.errorMessage.set(
      ''
    );

    this.selectedProduct.set(
      null
    );

    this.calculationResult.set(
      null
    );

    this.isPaymentPlanOpen.set(
      false
    );

    this.clearMissingBankToast();


    // ==========================================
    // BANKA ID'LERİ
    // ==========================================

    const bankIds =
      this.selectedBanks()
        .map(
          bank => bank.id
        );


    // ==========================================
    // API
    // ==========================================

    this.loanProductService
      .search({

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

      })
      .subscribe({

        next: (products) => {

          this.results.set(
            products
          );

          this.isLoading.set(
            false
          );


          // ======================================
          // SONUÇ GELMEYEN BANKALARI BUL
          // ======================================

          if (
            this.selectedBanks().length > 0
          ) {

            const resultBankNames =
              new Set(
                products.map(
                  product =>
                    product.bankName
                      .trim()
                      .toLocaleLowerCase(
                        'tr-TR'
                      )
                )
              );


            const missing =
              this.selectedBanks()
                .filter(bank => {

                  const normalizedBankName =
                    bank.name
                      .trim()
                      .toLocaleLowerCase(
                        'tr-TR'
                      );


                  return !resultBankNames.has(
                    normalizedBankName
                  );

                });


            if (
              missing.length > 0
            ) {

              this.showMissingBankToast(
                missing
              );

            }

          }


          // ======================================
          // SONUÇ ALANINA KAYDIR
          // ======================================

          if (scrollToResults) {

            setTimeout(() => {

              // Ürün varsa sonuç tablosuna git
              if (
                products.length > 0
              ) {

                this.resultsSection()
                  ?.nativeElement
                  .scrollIntoView({

                    behavior:
                      'smooth',

                    block:
                      'start'

                  });

              }

              // Ürün yoksa boş sonuç alanına git
              else {

                this.emptyResultSection()
                  ?.nativeElement
                  .scrollIntoView({

                    behavior:
                      'smooth',

                    block:
                      'center'

                  });

              }

            }, 100);

          }

        },


        error: (err) => {

          console.error(
            'Kredi ürünleri hatası:',
            err
          );


          this.errorMessage.set(
            err.error?.message ??
            'Kredi ürünleri getirilirken hata oluştu.'
          );


          this.isLoading.set(
            false
          );


          this.clearMissingBankToast();

        }

      });

  }


  // ==========================================
  // TOAST GÖSTER
  // ==========================================

  private showMissingBankToast(
    banks: SelectedBank[]
  ): void {

    this.clearMissingBankToast();


    this.missingBanks.set(
      banks
    );


    this.missingBankToastTimer =
      setTimeout(() => {

        this.missingBanks.set(
          []
        );


        this.missingBankToastTimer =
          null;

      }, 4000);

  }


  // ==========================================
  // TOAST TEMİZLE
  // ==========================================

  private clearMissingBankToast(): void {

    if (
      this.missingBankToastTimer
    ) {

      clearTimeout(
        this.missingBankToastTimer
      );


      this.missingBankToastTimer =
        null;

    }


    this.missingBanks.set(
      []
    );

  }


  // ==========================================
  // ÜRÜN SEÇ
  // ==========================================

  selectProduct(
    product: ProductSearchResultDto
  ): void {

    this.selectedProduct.set(
      product
    );


    this.calculationResult.set(
      null
    );


    this.isCalculating.set(
      true
    );


    this.errorMessage.set(
      ''
    );


    this.loanCalculationService
      .calculate({

        loanProductId:
          product.loanProductId,

        amount:
          this.loanAmount,

        term:
          this.maturity

      })
      .subscribe({

        next: (data) => {

          this.calculationResult.set(
            data
          );


          this.isCalculating.set(
            false
          );


          this.isPaymentPlanOpen.set(
            true
          );

        },


        error: (err) => {

          console.error(
            'Hesaplama hatası:',
            err
          );


          this.errorMessage.set(
            err.error?.message ??
            'Hesaplama sırasında hata oluştu.'
          );


          this.isCalculating.set(
            false
          );

        }

      });

  }


  // ==========================================
  // MODAL KAPAT
  // ==========================================

  closePaymentPlan(): void {

    this.isPaymentPlanOpen.set(
      false
    );

  }


  // ==========================================
  // BAŞVURU
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
        'Başvuru yapmak için önce kredi hesaplaması yapmalısınız.'
      );

      return;
    }


    const token =
      localStorage.getItem(
        'token'
      );


    // Giriş yapılmamış
    if (!token) {

      sessionStorage.setItem(
        'pendingLoanApplication',

        JSON.stringify({

          loanProductId:
            product.loanProductId,

          loanCalculationId:
            calculation.id

        })
      );


      this.isPaymentPlanOpen.set(
        false
      );


      this.router.navigate([
        '/login'
      ]);


      return;
    }


    // ==========================================
    // BAŞVURU OLUŞTUR
    // ==========================================

    this.loanApplicationService
      .create({

        loanProductId:
          product.loanProductId,

        loanCalculationId:
          calculation.id

      })
      .subscribe({

        next: (response) => {

          console.log(
            'Başvuru başarılı:',
            response
          );


          this.isPaymentPlanOpen.set(
            false
          );


          sessionStorage.removeItem(
            'pendingLoanApplication'
          );


          alert(
            'Kredi başvurunuz başarıyla oluşturuldu.'
          );

        },


        error: (err) => {

          console.error(
            'Başvuru hatası:',
            err
          );


          if (
            err.status === 401
          ) {

            localStorage.removeItem(
              'token'
            );


            sessionStorage.setItem(
              'pendingLoanApplication',

              JSON.stringify({

                loanProductId:
                  product.loanProductId,

                loanCalculationId:
                  calculation.id

              })
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

}