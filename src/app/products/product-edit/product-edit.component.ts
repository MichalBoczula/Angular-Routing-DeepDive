import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from '../../messages/message.service';

import { Product, ProductResolved } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle = 'Product Edit';
  errorMessage = '';
  product: Product | null = null;
  private dataIsValid: { [key: string]: boolean } = {}

  constructor(private productService: ProductService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router) { }

  getProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: product => this.onProductRetrieved(product),
      error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product | null): void {
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }

  deleteProduct(): void {
    if (!this.product || !this.product.id) {
      // Don't delete, it was never saved.
      this.onSaveComplete(`${this.product?.productName} was deleted`);
    } else {
      if (confirm(`Really delete the product: ${this.product.productName}?`)) {
        this.productService.deleteProduct(this.product.id).subscribe({
          next: () => this.onSaveComplete(`${this.product?.productName} was deleted`),
          error: err => this.errorMessage = err
        });
      }
    }
    this.router.navigate(['/products']);
  }

  saveProduct(): void {
    if (this.product) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product?.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
    this.router.navigate(['/products']);
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
      this.router.navigate(['/products'])
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }


  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const resolvedData: ProductResolved = data['resolvedData'];

      if (resolvedData.error !== undefined) {
        this.errorMessage = String(resolvedData.error);
      }

      this.onProductRetrieved(resolvedData.product)
    })
  }

  isValid(path? : string): boolean {
    this.validate();
    if(path)
    {
      return this.dataIsValid[path];
    }
    return(this.dataIsValid &&
       Object.keys(this.dataIsValid)
       .every(ele => this.dataIsValid[ele] === true))
  }

  validate(): void {
    this.dataIsValid = {}
    if (this.product?.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode) {
      this.dataIsValid['info'] = true;
    }
    else {
      this.dataIsValid['info'] = false;
    }

    if (this.product?.category &&
      this.product.category.length >= 3) {
      this.dataIsValid['info'] = true;
    }
    else {
      this.dataIsValid['info'] = false;
    }
  }

}
