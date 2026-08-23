import {
  Component,
  input,
  output
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ProductSearchResultDto
} from '../../../services/models/loan-product.model';

@Component({
  selector: 'app-loan-results',

  imports: [
    CommonModule
  ],

  templateUrl: './loan-results.html',
  styleUrl: './loan-results.scss',
})
export class LoanResults {

  // Parent componentten gelen kredi ürünleri
  results =
    input<ProductSearchResultDto[]>([]);


  // Seçilen ürünü parent componente gönderir
  productSelected =
    output<ProductSearchResultDto>();


  selectProduct(
    product: ProductSearchResultDto
  ): void {

    this.productSelected.emit(product);

  }

}