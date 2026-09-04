import {
  Component,
  computed,
  inject,
  OnInit,
  output,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  LoanType
} from '../../../services/loan-type/loan-type';

import {
  LoanProduct
} from '../../../services/loan-product/loan-product';

import {
  LoanTypeDto
} from '../../../services/models/loan-type.model';

import {
  LoanProductDto
} from '../../../services/models/loan-product.model';


@Component({
  selector: 'app-loan-search',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './loan-search.html',
  styleUrl: './loan-search.scss',
})
export class LoanSearch implements OnInit {

  // ==========================================
  // SERVICES
  // ==========================================

  private loanTypeService =
    inject(LoanType);

  private loanProductService =
    inject(LoanProduct);


  // ==========================================
  // KREDİ TÜRLERİ
  // ==========================================

  loanTypes =
    signal<LoanTypeDto[]>([]);


  selectedLoanTypeId =
    signal<number | null>(null);


  // ==========================================
  // KREDİ ÜRÜNLERİ
  // ==========================================

  loanProducts =
    signal<LoanProductDto[]>([]);


  selectedTypeProducts =
    computed(() => {

      const loanTypeId =
        this.selectedLoanTypeId();


      if (loanTypeId === null) {
        return [];
      }


      return this.loanProducts()
        .filter(
          product =>
            product.loanTypeId === loanTypeId &&
            product.isActive
        );

    });


  // ==========================================
  // TUTAR SINIRLARI
  // ==========================================

  minAmount =
    computed(() => {

      const products =
        this.selectedTypeProducts();


      if (products.length === 0) {
        return 1000;
      }


      return Math.min(
        ...products.map(
          product =>
            product.minAmount
        )
      );

    });


  maxAmount =
    computed(() => {

      const products =
        this.selectedTypeProducts();


      if (products.length === 0) {
        return 1000000;
      }


      return Math.max(
        ...products.map(
          product =>
            product.maxAmount
        )
      );

    });


  // ==========================================
  // VADE SINIRLARI
  // ==========================================

  minTerm =
    computed(() => {

      const products =
        this.selectedTypeProducts();


      if (products.length === 0) {
        return 3;
      }


      return Math.min(
        ...products.map(
          product =>
            product.minTerm
        )
      );

    });


  maxTerm =
    computed(() => {

      const products =
        this.selectedTypeProducts();


      if (products.length === 0) {
        return 36;
      }


      return Math.max(
        ...products.map(
          product =>
            product.maxTerm
        )
      );

    });


  // ==========================================
  // FORM
  // ==========================================

  loanAmount =
    25000;


  maturity =
    12;


  private hasPerformedInitialSearch =
    false;


  // ==========================================
  // OUTPUT
  // ==========================================

  searchChange =
    output<{
      loanTypeId: number;
      amount: number;
      term: number;
    }>();


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadLoanTypes();

    this.loadLoanProducts();

  }


  // ==========================================
  // KREDİ TÜRLERİNİ GETİR
  // ==========================================

  private loadLoanTypes(): void {

    this.loanTypeService
      .getAll()
      .subscribe({

        next: (data) => {

          this.loanTypes.set(
            data
          );

        },

        error: (err) => {

          console.error(
            'Kredi türleri yüklenemedi:',
            err
          );

        }

      });

  }


  // ==========================================
  // KREDİ ÜRÜNLERİNİ GETİR
  // ==========================================

  private loadLoanProducts(): void {

    this.loanProductService
      .getAll()
      .subscribe({

        next: (data) => {

          this.loanProducts.set(
            data
          );

        },

        error: (err) => {

          console.error(
            'Kredi ürünleri yüklenemedi:',
            err
          );

        }

      });

  }


  // ==========================================
  // KREDİ TÜRÜ SEÇ
  // ==========================================

  selectLoanType(
    id: number
  ): void {

    this.selectedLoanTypeId.set(
      id
    );


    const products =
      this.loanProducts()
        .filter(
          product =>
            product.loanTypeId === id &&
            product.isActive
        );


    if (products.length === 0) {
      return;
    }


    const minAmount =
      Math.min(
        ...products.map(
          product =>
            product.minAmount
        )
      );


    const maxAmount =
      Math.max(
        ...products.map(
          product =>
            product.maxAmount
        )
      );


    const minTerm =
      Math.min(
        ...products.map(
          product =>
            product.minTerm
        )
      );


    const maxTerm =
      Math.max(
        ...products.map(
          product =>
            product.maxTerm
        )
      );


    if (
      this.loanAmount < minAmount ||
      this.loanAmount > maxAmount
    ) {

      this.loanAmount =
        minAmount;

    }


    if (
      this.maturity < minTerm ||
      this.maturity > maxTerm
    ) {

      this.maturity =
        minTerm;

    }


    if (
      this.hasPerformedInitialSearch
    ) {

      this.emitCurrentSearch();

    }

  }


  // ==========================================
  // TUTAR INPUT
  // ==========================================

  onAmountInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    let rawValue =
      input.value
        .replace(/\./g, '')
        .replace(/\D/g, '');


    if (!rawValue) {

      this.loanAmount =
        0;

      input.value =
        '';

      return;

    }


    let value =
      Number(rawValue);


    const max =
      this.maxAmount();


    if (value > max) {

      value =
        max;

    }


    this.loanAmount =
      value;


    input.value =
      this.formatAmount(
        value
      );

  }


  // ==========================================
  // TUTAR FORMATLA
  // ==========================================

  formatAmount(
    value: number
  ): string {

    if (
      value === null ||
      Number.isNaN(value)
    ) {
      return '';
    }


    return new Intl.NumberFormat(
      'tr-TR',
      {
        maximumFractionDigits: 0
      }
    ).format(
      value
    );

  }


  // ==========================================
  // TUTAR SINIRLA
  // ==========================================

  normalizeAmount(): void {

    const min =
      this.minAmount();

    const max =
      this.maxAmount();


    if (
      this.loanAmount === null ||
      Number.isNaN(this.loanAmount) ||
      this.loanAmount === 0
    ) {

      this.loanAmount =
        min;

      return;

    }


    if (
      this.loanAmount < min
    ) {

      this.loanAmount =
        min;

    }


    if (
      this.loanAmount > max
    ) {

      this.loanAmount =
        max;

    }

  }


  // ==========================================
  // VADE INPUT
  // ==========================================

  onTermInput(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    let rawValue =
      input.value.replace(
        /\D/g,
        ''
      );


    if (!rawValue) {

      this.maturity =
        0;

      input.value =
        '';

      return;

    }


    let value =
      Number(rawValue);


    const max =
      this.maxTerm();


    if (value > max) {

      value =
        max;

    }


    this.maturity =
      value;


    input.value =
      value.toString();

  }


  // ==========================================
  // VADE SINIRLA
  // ==========================================

  normalizeTerm(): void {

    const min =
      this.minTerm();

    const max =
      this.maxTerm();


    if (
      this.maturity === null ||
      Number.isNaN(this.maturity) ||
      this.maturity === 0
    ) {

      this.maturity =
        min;

      return;

    }


    if (
      this.maturity < min
    ) {

      this.maturity =
        min;

    }


    if (
      this.maturity > max
    ) {

      this.maturity =
        max;

    }


    this.maturity =
      Math.round(
        this.maturity
      );

  }


  // ==========================================
  // TUTAR INPUT BLUR
  // ==========================================

  onAmountBlur(
    event?: Event
  ): void {

    this.normalizeAmount();


    if (event) {

      const input =
        event.target as HTMLInputElement;


      input.value =
        this.formatAmount(
          this.loanAmount
        );

    }


    if (
      this.hasPerformedInitialSearch
    ) {

      this.emitCurrentSearch();

    }

  }


  // ==========================================
  // VADE INPUT BLUR
  // ==========================================

  onTermBlur(
    event?: Event
  ): void {

    this.normalizeTerm();


    if (event) {

      const input =
        event.target as HTMLInputElement;


      input.value =
        this.maturity.toString();

    }


    if (
      this.hasPerformedInitialSearch
    ) {

      this.emitCurrentSearch();

    }

  }


  // ==========================================
  // TUTAR SLIDER
  // ==========================================

  onAmountSliderChange(): void {

    this.normalizeAmount();


    if (
      !this.hasPerformedInitialSearch
    ) {
      return;
    }


    this.emitCurrentSearch();

  }


  // ==========================================
  // VADE SLIDER
  // ==========================================

  onTermSliderChange(): void {

    this.normalizeTerm();


    if (
      !this.hasPerformedInitialSearch
    ) {
      return;
    }


    this.emitCurrentSearch();

  }


  // ==========================================
  // ARAMA
  // ==========================================

  search(): void {

    const loanTypeId =
      this.selectedLoanTypeId();


    if (
      loanTypeId === null
    ) {
      return;
    }


    this.normalizeAmount();

    this.normalizeTerm();


    this.hasPerformedInitialSearch =
      true;


    this.emitCurrentSearch();

  }


  // ==========================================
  // PARENT'A GÖNDER
  // ==========================================

  private emitCurrentSearch(): void {

    const loanTypeId =
      this.selectedLoanTypeId();


    if (
      loanTypeId === null
    ) {
      return;
    }


    this.normalizeAmount();

    this.normalizeTerm();


    this.searchChange.emit({

      loanTypeId:
        loanTypeId,

      amount:
        this.loanAmount,

      term:
        this.maturity

    });

  }

}