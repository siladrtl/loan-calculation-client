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

import {
  LoanCalculation
} from '../../services/loan-calculation/loan-calculation';

import {
  LoanCalculationResponseDto
} from '../../services/models/loan-calculation.model';

import {
  LoanApplication
} from '../../services/loan-application/loan-application';

import {
  LoginService
} from '../../services/auth/login';

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

  private loginService =
    inject(LoginService);

  private router =
    inject(Router);


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor() {

    this.restorePendingLoanApplication();

  }


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
    ReturnType<typeof setTimeout> | null =
      null;


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

  loanAmount =
    0;

  maturity =
    12;


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
  // MÜŞTERİ UYGUNLUĞU
  // ==========================================

  isCustomerEligible =
    signal(true);

  eligibilityMessage =
    signal('');


  // ==========================================
  // ÖDEME PLANI MODALI
  // ==========================================

  isPaymentPlanOpen =
    signal(false);


  // ==========================================
  // BAŞVURU BAŞARI MODALI
  // ==========================================

  applicationSuccess =
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


    if (!lastSearch) {

      return;

    }


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

    this.isCustomerEligible.set(
      true
    );

    this.eligibilityMessage.set(
      ''
    );


    this.clearMissingBankToast();


    const bankIds =
      this.selectedBanks()
        .map(
          bank => bank.id
        );


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
          // SEÇİLİ BANKALARDA SONUÇ BULUNAMADI MI?
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
          // SONUÇLARA SCROLL
          // ======================================

          if (scrollToResults) {

            setTimeout(() => {

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


    this.isCustomerEligible.set(
      true
    );


    this.eligibilityMessage.set(
      ''
    );


    // ======================================
    // ÖDEME PLANI HESAPLA
    // ======================================

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


          // ======================================
          // GİRİŞ YAPMAMIŞ KULLANICI
          // ======================================

          if (
            !this.loginService.isLoggedIn()
          ) {

            this.isCustomerEligible.set(
              true
            );

            this.isCalculating.set(
              false
            );

            this.isPaymentPlanOpen.set(
              true
            );

            return;

          }


          // ======================================
          // CUSTOMER DEĞİLSE
          // ======================================

          if (
            !this.loginService.isCustomer()
          ) {

            this.isCustomerEligible.set(
              false
            );

            this.eligibilityMessage.set(
              'Kredi başvurusu yalnızca müşteri hesabıyla yapılabilir.'
            );

            this.isCalculating.set(
              false
            );

            this.isPaymentPlanOpen.set(
              true
            );

            return;

          }


          // ======================================
          // CUSTOMER UYGUNLUK KONTROLÜ
          // ======================================

          this.loanApplicationService
            .checkEligibility(
              product.loanProductId
            )
            .subscribe({

              next: (eligibility) => {

                this.isCustomerEligible.set(
                  eligibility.isEligible
                );


                this.eligibilityMessage.set(
                  eligibility.isEligible
                    ? ''
                    : eligibility.message
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
                  'Müşteri uygunluk kontrolü hatası:',
                  err
                );


                this.isCustomerEligible.set(
                  false
                );


                this.eligibilityMessage.set(
                  err.error?.message ??
                  'Müşteri uygunluğu kontrol edilemedi.'
                );


                this.isCalculating.set(
                  false
                );


                this.isPaymentPlanOpen.set(
                  true
                );

              }

            });

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
  // BEKLEYEN KREDİ İŞLEMİNİ GERİ YÜKLE
  // ==========================================

  private restorePendingLoanApplication(): void {

    if (
      !this.loginService.isLoggedIn() ||
      !this.loginService.isCustomer()
    ) {

      return;

    }


    const pendingJson =
      sessionStorage.getItem(
        'pendingLoanApplication'
      );


    if (!pendingJson) {

      return;

    }


    try {

      const pending =
        JSON.parse(
          pendingJson
        );


      if (
        !pending.product ||
        !pending.calculation
      ) {

        sessionStorage.removeItem(
          'pendingLoanApplication'
        );

        return;

      }


      const product =
        pending.product as ProductSearchResultDto;


      const calculation =
        pending.calculation as LoanCalculationResponseDto;

        sessionStorage.removeItem(
  'pendingLoanApplication'
);


      this.selectedProduct.set(
        product
      );


      this.calculationResult.set(
        calculation
      );


      this.loanAmount =
        calculation.amount;


      this.maturity =
        calculation.term;


      this.errorMessage.set(
        ''
      );


      this.eligibilityMessage.set(
        ''
      );


      this.isCustomerEligible.set(
        true
      );


      this.isCalculating.set(
        true
      );


      // ======================================
      // LOGIN SONRASI UYGUNLUK KONTROLÜ
      // ======================================

      this.loanApplicationService
        .checkEligibility(
          product.loanProductId
        )
        .subscribe({

          next: (eligibility) => {

            this.isCustomerEligible.set(
              eligibility.isEligible
            );


            this.eligibilityMessage.set(
              eligibility.isEligible
                ? ''
                : eligibility.message
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
              'Bekleyen başvuru uygunluk kontrolü hatası:',
              err
            );


            this.isCustomerEligible.set(
              false
            );


            this.eligibilityMessage.set(
              err.error?.message ??
              'Müşteri uygunluğu kontrol edilemedi.'
            );


            this.isCalculating.set(
              false
            );


            this.isPaymentPlanOpen.set(
              true
            );

          }

        });

    }
    catch (error) {

      console.error(
        'Bekleyen kredi işlemi okunamadı:',
        error
      );


      sessionStorage.removeItem(
        'pendingLoanApplication'
      );

    }

  }


  // ==========================================
  // ÖDEME PLANI MODALINI KAPAT
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


    // ==========================================
    // LOGIN KONTROLÜ
    // ==========================================

    if (
      !this.loginService.isLoggedIn()
    ) {

      sessionStorage.setItem(
        'pendingLoanApplication',

        JSON.stringify({

          loanProductId:
            product.loanProductId,

          loanCalculationId:
            calculation.id,

          product:
            product,

          calculation:
            calculation

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
    // SADECE CUSTOMER BAŞVURABİLİR
    // ==========================================

    if (
      !this.loginService.isCustomer()
    ) {

      this.isCustomerEligible.set(
        false
      );


      this.eligibilityMessage.set(
        'Kredi başvurusu yalnızca müşteri hesabıyla yapılabilir.'
      );


      return;

    }


    // ==========================================
    // BAŞVURU ÖNCESİ UYGUNLUK KONTROLÜ
    // ==========================================

    this.loanApplicationService
      .checkEligibility(
        product.loanProductId
      )
      .subscribe({

        next: (eligibility) => {

          this.isCustomerEligible.set(
            eligibility.isEligible
          );


          this.eligibilityMessage.set(
            eligibility.isEligible
              ? ''
              : eligibility.message
          );


          // Uygun değilse başvuru oluşturma
          if (
            !eligibility.isEligible
          ) {

            return;

          }


          // Uygunsa başvuruyu oluştur
          this.createLoanApplication(
            product.loanProductId,
            calculation.id,
            product,
            calculation
          );

        },


        error: (err) => {

          console.error(
            'Başvuru uygunluk kontrolü hatası:',
            err
          );


          this.isCustomerEligible.set(
            false
          );


          this.eligibilityMessage.set(
            err.error?.message ??
            'Başvuru uygunluğu kontrol edilemedi.'
          );

        }

      });

  }


  // ==========================================
  // KREDİ BAŞVURUSUNU OLUŞTUR
  // ==========================================

  private createLoanApplication(
    loanProductId: number,
    loanCalculationId: number,
    product: ProductSearchResultDto,
    calculation: LoanCalculationResponseDto
  ): void {

    this.loanApplicationService
      .create({

        loanProductId:
          loanProductId,

        loanCalculationId:
          loanCalculationId

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


          this.applicationSuccess.set(
            true
          );

        },


        error: (err) => {

          console.error(
            'Başvuru hatası:',
            err
          );


          // ======================================
          // TOKEN SÜRESİ DOLMUŞSA
          // ======================================

          if (
            err.status === 401
          ) {

            this.loginService
              .logout();


            sessionStorage.setItem(
              'pendingLoanApplication',

              JSON.stringify({

                loanProductId:
                  product.loanProductId,

                loanCalculationId:
                  calculation.id,

                product:
                  product,

                calculation:
                  calculation

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


          // Backend başvuruyu engellediyse
          // mesajı ödeme planında göster.
          this.isCustomerEligible.set(
            false
          );


          this.eligibilityMessage.set(
            err.error?.message ??
            'Başvuru sırasında bir hata oluştu.'
          );

        }

      });

  }


  // ==========================================
  // BAŞARI MODALINI KAPAT
  // ==========================================

  closeApplicationSuccess(): void {

    this.applicationSuccess.set(
      false
    );

  }


  // ==========================================
  // BAŞVURULARIMA GİT
  // ==========================================

  goToMyApplications(): void {

    this.applicationSuccess.set(
      false
    );


    this.router.navigate([
      '/my-applications'
    ]);

  }

}