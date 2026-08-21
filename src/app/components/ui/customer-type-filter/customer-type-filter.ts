import {
  Component,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CustomerType } from '../../../services/models/customer-type.model';


@Component({
  selector: 'app-customer-type-filter',
  imports: [
    CommonModule
  ],
  templateUrl: './customer-type-filter.html',
  styleUrl: './customer-type-filter.scss',
})
export class CustomerTypeFilter {

  customerTypes = [
    {
      id: CustomerType.Ogrenci,
      name: 'Öğrenci'
    },
    {
      id: CustomerType.Esnaf,
      name: 'Esnaf'
    },
    {
      id: CustomerType.Emekli,
      name: 'Emekli'
    }
  ];


  selectedCustomerType =
    signal<CustomerType | null>(null);


  customerTypeSelectionChange =
    output<CustomerType | undefined>();


  selectCustomerType(
    customerType: CustomerType
  ): void {

    // Aynı tipe tekrar basarsa seçimi kaldır
    if (
      this.selectedCustomerType() ===
      customerType
    ) {

      this.selectedCustomerType.set(
        null
      );

      this.customerTypeSelectionChange.emit(
        undefined
      );

      return;
    }


    this.selectedCustomerType.set(
      customerType
    );

    this.customerTypeSelectionChange.emit(
      customerType
    );
  }


  clearCustomerType(): void {

    this.selectedCustomerType.set(
      null
    );

    this.customerTypeSelectionChange.emit(
      undefined
    );
  }
}