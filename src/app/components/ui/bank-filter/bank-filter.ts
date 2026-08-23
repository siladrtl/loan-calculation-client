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

export interface SelectedBank {
  id: number;
  name: string;
}

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

  banks =
    signal<Bank[]>([]);

  selectedBankIds =
    signal<Set<number>>(new Set());

  bankSelectionChange =
    output<SelectedBank[]>();


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

    this.emitSelectedBanks();
  }


  isBankSelected(
    bankId: number
  ): boolean {

    return this.selectedBankIds()
      .has(bankId);
  }


  clearBankFilter(): void {

    this.selectedBankIds.set(
      new Set()
    );

    this.bankSelectionChange.emit(
      []
    );

  }


  private emitSelectedBanks(): void {

    const selectedBanks =
      this.banks()
        .filter(bank =>
          this.selectedBankIds()
            .has(bank.id)
        )
        .map(bank => ({
          id: bank.id,
          name: bank.name
        }));

    this.bankSelectionChange.emit(
      selectedBanks
    );
  }

}