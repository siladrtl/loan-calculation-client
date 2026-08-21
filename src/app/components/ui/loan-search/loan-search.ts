import {
  Component,
  inject,
  OnInit,
  output,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanType } from '../../../services/loan-type/loan-type';
import { LoanProduct } from '../../../services/loan-product/loan-product';

import { LoanTypeDto } from '../../../services/models/loan-type.model';
import { LoanProductDto } from '../../../services/models/loan-product.model';

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

  private loanTypeService =
    inject(LoanType);

  private loanProductService =
    inject(LoanProduct);


  // -----------------------------
  // KREDİ TÜRLERİ
  // -----------------------------

  loanTypes =
    signal<LoanTypeDto[]>([]);

  selectedLoanTypeId =
    signal<number | null>(null);


  // -----------------------------
  // ÜRÜNLER
  // -----------------------------

  loanProducts =
    signal<LoanProductDto[]>([]);


  // Seçilen kredi türüne ait bütün ürünler
  selectedTypeProducts = computed(() => {

    const loanTypeId =
      this.selectedLoanTypeId();

    if (loanTypeId === null) {
      return [];
    }

    return this.loanProducts().filter(
      product =>
        product.loanTypeId === loanTypeId &&
        product.isActive
    );

  });


  // -----------------------------
  // TUTAR SINIRLARI
  // -----------------------------

  minAmount = computed(() => {

    const products =
      this.selectedTypeProducts();

    if (products.length === 0) {
      return 0;
    }

    return Math.min(
      ...products.map(x => x.minAmount)
    );

  });


  maxAmount = computed(() => {

    const products =
      this.selectedTypeProducts();

    if (products.length === 0) {
      return 0;
    }

    return Math.max(
      ...products.map(x => x.maxAmount)
    );

  });


  // -----------------------------
  // VADE SINIRLARI
  // -----------------------------

  minTerm = computed(() => {

    const products =
      this.selectedTypeProducts();

    if (products.length === 0) {
      return 0;
    }

    return Math.min(
      ...products.map(x => x.minTerm)
    );

  });


  maxTerm = computed(() => {

    const products =
      this.selectedTypeProducts();

    if (products.length === 0) {
      return 0;
    }

    return Math.max(
      ...products.map(x => x.maxTerm)
    );

  });


  // Kullanıcının seçebileceği vadeler
  termOptions = computed(() => {

    const min =
      this.minTerm();

    const max =
      this.maxTerm();

    if (min === 0 || max === 0) {
      return [];
    }

    const terms: number[] = [];

    for (
      let term = min;
      term <= max;
      term++
    ) {
      terms.push(term);
    }

    return terms;

  });


  // -----------------------------
  // FORM
  // -----------------------------

  loanAmount = 0;

  maturity = 0;


  // -----------------------------
  // OUTPUT
  // -----------------------------

  searchChange = output<{
    loanTypeId: number;
    amount: number;
    term: number;
  }>();


  // -----------------------------
  // INIT
  // -----------------------------

  ngOnInit(): void {

    this.loadLoanTypes();

    this.loadLoanProducts();

  }


  // -----------------------------
  // KREDİ TÜRLERİNİ GETİR
  // -----------------------------

  private loadLoanTypes(): void {

    this.loanTypeService
      .getAll()
      .subscribe({

        next: (data) => {

          this.loanTypes.set(data);

        },

        error: (err) => {

          console.error(
            'Kredi türleri yüklenemedi:',
            err
          );

        }

      });

  }


  // -----------------------------
  // ÜRÜNLERİ GETİR
  // -----------------------------

  private loadLoanProducts(): void {

    this.loanProductService
      .getAll()
      .subscribe({

        next: (data) => {

          this.loanProducts.set(data);

        },

        error: (err) => {

          console.error(
            'Kredi ürünleri yüklenemedi:',
            err
          );

        }

      });

  }


  // -----------------------------
  // KREDİ TÜRÜ SEÇ
  // -----------------------------

  selectLoanType(
    id: number
  ): void {

    this.selectedLoanTypeId.set(id);

    // Kredi türü değiştiğinde
    // formu geçerli başlangıç değerlerine çekiyoruz.

    setTimeout(() => {

      this.loanAmount =
        this.minAmount();

      this.maturity =
        this.minTerm();

    });

  }


  // -----------------------------
  // TUTAR SINIRLA
  // -----------------------------

  normalizeAmount(): void {

    if (this.loanAmount < this.minAmount()) {

      this.loanAmount =
        this.minAmount();

    }

    if (this.loanAmount > this.maxAmount()) {

      this.loanAmount =
        this.maxAmount();

    }

  }


  // -----------------------------
  // ARA
  // -----------------------------

  search(): void {

    const loanTypeId =
      this.selectedLoanTypeId();

    if (loanTypeId === null) {
      return;
    }

    this.normalizeAmount();

    this.searchChange.emit({

      loanTypeId,

      amount:
        this.loanAmount,

      term:
        this.maturity

    });

  }

}