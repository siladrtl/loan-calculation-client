import {
  Component,
  inject,
  OnInit,
  Output,
  EventEmitter,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoanType } from '../../../services/loan-type/loan-type';
import { LoanTypeDto } from '../../../services/models/loan-type.model';

@Component({
  selector: 'app-loan-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-search.html',
  styleUrl: './loan-search.scss',
})
export class LoanSearch implements OnInit {

  private loanTypeService = inject(LoanType);


  // Kredi türleri

  loanTypes = signal<LoanTypeDto[]>([]);

  selectedLoanTypeId = signal<string>('');


  // Form bilgileri

  loanAmount: number = 0;

  maturity: number = 12;


  // LoanCalculator'a gönderilecek veri

  @Output()
  searchChange = new EventEmitter<{
    loanTypeId: string;
    amount: number;
    term: number;
  }>();


  ngOnInit(): void {

    this.loanTypeService.getAll().subscribe({

      next: (data) => {

        this.loanTypes.set(data);

      },

      error: (err) => {

        console.error(
          'Kredi türleri yüklenemedi',
          err
        );

      }

    });

  }


  // Kredi türü seç

  selectLoanType(id: string): void {

    this.selectedLoanTypeId.set(id);

  }


  // Ara

  search(): void {

    console.log(
      'Kredi türü:',
      this.selectedLoanTypeId()
    );

    console.log(
      'Kredi tutarı:',
      this.loanAmount
    );

    console.log(
      'Vade:',
      this.maturity
    );


    // LoanCalculator'a verileri gönder

    this.searchChange.emit({

      loanTypeId:
        this.selectedLoanTypeId(),

      amount:
        this.loanAmount,

      term:
        this.maturity

    });

  }

}