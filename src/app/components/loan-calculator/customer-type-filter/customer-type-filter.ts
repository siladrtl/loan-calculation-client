import {
  Component,
  inject,
  OnInit,
  output,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { CustomerTypeService } from '../../../services/customer-type/customer-type';
import { CustomerType } from '../../../services/models/customer-type.model';

@Component({
  selector: 'app-customer-type-filter',

  imports: [
    CommonModule
  ],

  templateUrl: './customer-type-filter.html',
  styleUrl: './customer-type-filter.scss',
})
export class CustomerTypeFilter implements OnInit {

  private customerTypeService =
    inject(CustomerTypeService);


  customerTypes =
    signal<CustomerType[]>([]);


  selectedCustomerTypeId =
    signal<string>('');


  customerTypeSelectionChange =
    output<string>();


  ngOnInit(): void {

    this.customerTypeService
      .getAll()
      .subscribe({

        next: (data) => {

          this.customerTypes.set(data);

        },

        error: (err) => {

          console.error(
            'Müşteri tipleri yüklenemedi',
            err
          );

        }

      });

  }


  selectCustomerType(id: string): void {

    this.selectedCustomerTypeId.set(id);

    this.customerTypeSelectionChange.emit(id);

  }

}