import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HeaderComponent } from "../header/header.component";
import { CartService } from '../../services/cart-service.service';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  quantity: number = 1;
  cartMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductDetails(this.productId);
    }
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        this.product = response.product;
        this.product.image_path = `http://localhost:3900/${this.product.image_path}`;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }


addToCart(): void {
  if (!this.product) return;

  this.isLoading = true;
  this.cartMessage = '';

  this.cartService.addToCart(this.product.id, this.quantity).subscribe({
    next: () => {
      this.cartMessage = `${this.quantity} × ${this.product?.name} added to cart!`;
      this.isLoading = false;
      setTimeout(() => this.cartMessage = '', 3000);
    },
    error: (error) => {
      this.cartMessage = error.message || 'Failed to add to cart';
      this.isLoading = false;
      setTimeout(() => this.cartMessage = '', 3000);
    }
  });
}

  incrementQuantity(): void {
    if (this.quantity < 10) this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) this.quantity--;
  }
}