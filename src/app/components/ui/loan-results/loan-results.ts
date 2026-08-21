import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { ProductSearchResultDto } from '../../../services/models/loan-product.model';

@Component({
  selector: 'app-loan-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-results.html',
  styleUrl: './loan-results.scss',
})
export class LoanResults {

  @Input()
  results: ProductSearchResultDto[] = [];


  @Output()
  productSelected =
    new EventEmitter<ProductSearchResultDto>();


  selectProduct(
    product: ProductSearchResultDto
  ): void {

    this.productSelected.emit(product);

  }

}