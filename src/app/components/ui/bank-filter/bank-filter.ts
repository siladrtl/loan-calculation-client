import {
  Component,
  inject,
  OnInit,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { BankService } from '../../../services/bank/bank';
import { Bank } from '../../../services/models/bank.model';

@Component({
  selector: 'app-bank-filter',
  imports: [
    CommonModule
  ],
  templateUrl: './bank-filter.html',
  styleUrl: './bank-filter.scss',
})
export class BankFilter implements OnInit {

  private bankService =
    inject(BankService);


  // -----------------------------
  // BANKALAR
  // -----------------------------

  banks =
    signal<Bank[]>([]);


  // -----------------------------
  // SEÇİLİ BANKALAR
  // -----------------------------

  selectedBankIds =
    signal<Set<number>>(new Set());


  // Parent component'e gönderilecek banka ID'leri
  bankSelectionChange =
    output<number[]>();


  // -----------------------------
  // INIT
  // -----------------------------

  ngOnInit(): void {

    this.bankService.getAll().subscribe({

      next: (data) => {

        this.banks.set(
          [...data].sort((a, b) =>
            a.name.localeCompare(
              b.name,
              'tr'
            )
          )
        );

      },

      error: (err) => {

        console.error(
          'Bankalar yüklenemedi:',
          err
        );

      }

    });

  }


  // -----------------------------
  // BANKA SEÇ / KALDIR
  // -----------------------------

  toggleBank(
    bankId: number
  ): void {

    const current =
      new Set(
        this.selectedBankIds()
      );

    if (current.has(bankId)) {

      current.delete(bankId);

    }
    else {

      current.add(bankId);

    }

    this.selectedBankIds.set(
      current
    );

    this.bankSelectionChange.emit(
      Array.from(current)
    );

  }


  // -----------------------------
  // BANKA SEÇİLİ Mİ?
  // -----------------------------

  isBankSelected(
    bankId: number
  ): boolean {

    return this
      .selectedBankIds()
      .has(bankId);

  }


  // -----------------------------
  // FİLTRE TEMİZLE
  // -----------------------------

  clearBankFilter(): void {

    this.selectedBankIds.set(
      new Set()
    );

    this.bankSelectionChange.emit(
      []
    );

  }

}