import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanProduct } from '../../services/loan-product/loan-product';
import { ProductSearchResultDto } from '../../services/models/loan-product.model';

import { LoanCalculation } from '../../services/loan-calculation/loan-calculation';
import { LoanCalculationResponseDto } from '../../services/models/loan-calculation.model';

import { BankFilter } from './bank-filter/bank-filter';
import { CustomerTypeFilter } from './customer-type-filter/customer-type-filter';
import { LoanSearch } from './loan-search/loan-search';
import { LoanResults } from './loan-results/loan-results';
import { PaymentPlan } from './payment-plan/payment-plan';

@Component({
  selector: 'app-loan-calculator',

  imports: [
    CommonModule,
    BankFilter,
    CustomerTypeFilter,
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


  // -----------------------------
  // FİLTRELER
  // -----------------------------

  selectedBankIds =
    signal<Set<string>>(new Set());

  selectedCustomerTypeId =
    signal<string>('');


  // -----------------------------
  // ARAMA
  // -----------------------------

  loanAmount = 0;

  maturity = 12;


  // -----------------------------
  // SONUÇLAR
  // -----------------------------

  results =
    signal<ProductSearchResultDto[]>([]);

  isLoading =
    signal(false);

  errorMessage =
    signal('');


  // -----------------------------
  // SEÇİLEN ÜRÜN
  // -----------------------------

  selectedProduct =
    signal<ProductSearchResultDto | null>(null);


  // -----------------------------
  // HESAPLAMA
  // -----------------------------

  calculationResult =
    signal<LoanCalculationResponseDto | null>(null);

  isCalculating =
    signal(false);


  // -----------------------------
  // ÖDEME PLANI MODAL
  // -----------------------------

  isPaymentPlanOpen =
    signal(false);


  // -----------------------------
  // BANKA SEÇİMİ
  // -----------------------------

  onBankSelectionChange(
    bankIds: string[]
  ): void {

    this.selectedBankIds.set(
      new Set(bankIds)
    );

  }


  // -----------------------------
  // MÜŞTERİ TİPİ
  // -----------------------------

  onCustomerTypeSelectionChange(
    customerTypeId: string
  ): void {

    this.selectedCustomerTypeId.set(
      customerTypeId
    );

  }


  // -----------------------------
  // KREDİ ARAMA
  // -----------------------------

  searchLoanProducts(data: {
    loanTypeId: string;
    amount: number;
    term: number;
  }): void {

  

    if (data.amount <= 0) {

      this.errorMessage.set(
        'Lütfen geçerli bir kredi tutarı giriniz.'
      );

      return;
    }


    this.loanAmount = data.amount;

    this.maturity = data.term;


    this.isLoading.set(true);

    this.errorMessage.set('');

    this.results.set([]);

    this.selectedProduct.set(null);

    this.calculationResult.set(null);

    this.isPaymentPlanOpen.set(false);


    const bankIds =
      Array.from(this.selectedBankIds());


    const customerTypeId =
      this.selectedCustomerTypeId();


    this.loanProductService.search({

      loanTypeId:
        data.loanTypeId,

      // Müşteri tipi seçilmişse gönder.
      // Seçilmemişse undefined gönder.
      customerTypeId:
        customerTypeId
          ? customerTypeId
          : undefined,

      amount:
        data.amount,

      term:
        data.term,

      bankIds:
        bankIds.length > 0
          ? bankIds
          : undefined

    }).subscribe({

      next: (data) => {

        console.log(
          'Kredi ürünleri:',
          data
        );

        this.results.set(data);

        this.isLoading.set(false);

      },

      error: (err) => {

        console.error(
          'Kredi ürünleri hatası:',
          err
        );

        this.errorMessage.set(
          'Kredi ürünleri getirilirken hata oluştu.'
        );

        this.isLoading.set(false);

      }

    });

  }


  // -----------------------------
  // ÜRÜN SEÇ
  // -----------------------------

  selectProduct(
    product: ProductSearchResultDto
  ): void {

    console.log(
      'Seçilen ürün:',
      product
    );


    this.selectedProduct.set(product);

    this.calculationResult.set(null);

    this.isCalculating.set(true);

    this.errorMessage.set('');


    this.loanCalculationService.calculate({

      loanProductId:
        product.loanProductId,

      amount:
        this.loanAmount,

      term:
        this.maturity

    }).subscribe({

      next: (data) => {

        console.log(
          'Hesaplama sonucu:',
          data
        );

        console.log(
          'Ödeme planı:',
          data.paymentPlans
        );

        this.calculationResult.set(data);

        this.isCalculating.set(false);

        // Ödeme planını aç
        this.isPaymentPlanOpen.set(true);

      },

      error: (err) => {

        console.error(
          'Hesaplama hatası:',
          err
        );

        this.errorMessage.set(
          'Hesaplama sırasında hata oluştu.'
        );

        this.isCalculating.set(false);

      }

    });

  }


  // -----------------------------
  // ÖDEME PLANINI KAPAT
  // -----------------------------

  closePaymentPlan(): void {

    this.isPaymentPlanOpen.set(false);

  }


  // -----------------------------
  // BAŞVURU
  // -----------------------------

  applyForLoan(): void {

    const product =
      this.selectedProduct();

    if (!product) {
      return;
    }


    console.log(
      'Başvuru yapılacak ürün:',
      product
    );


    this.isPaymentPlanOpen.set(false);

  }

}