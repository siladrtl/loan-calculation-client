import { Component, inject, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BankService } from '../../../services/bank/bank';
import { Bank } from '../../../services/models/bank.model';

@Component({
  selector: 'app-bank-filter',
  imports: [CommonModule],
  templateUrl: './bank-filter.html',
  styleUrl: './bank-filter.scss',
})
export class BankFilter implements OnInit {

  private bankService = inject(BankService);

  // Bankalar
  banks = signal<Bank[]>([]);

  // Seçili bankalar
  selectedBankIds = signal<Set<string>>(new Set());

  // Seçilen bankaları LoanCalculator'a göndermek için
  bankSelectionChange = output<string[]>();


  ngOnInit(): void {

    this.bankService.getAll().subscribe({

      next: (data) => {

        this.banks.set(
          [...data].sort((a, b) =>
            a.name.localeCompare(b.name, 'tr')
          )
        );

      },

      error: (err) => {
        console.error('Bankalar yüklenemedi', err);
      }

    });

  }


  // Banka seç / kaldır
  toggleBank(bankId: string): void {

    const current = new Set(this.selectedBankIds());

    if (current.has(bankId)) {
      current.delete(bankId);
    } else {
      current.add(bankId);
    }

    this.selectedBankIds.set(current);

    this.bankSelectionChange.emit(
      Array.from(current)
    );

  }


  // Banka seçili mi?
  isBankSelected(bankId: string): boolean {

    return this.selectedBankIds().has(bankId);

  }


  // Banka filtrelerini temizle
  clearBankFilter(): void {

    this.selectedBankIds.set(new Set());

    this.bankSelectionChange.emit([]);

  }

}