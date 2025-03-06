import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  product: any = null; // Product details fetched from the backend
  quantity: number = 1; // Default quantity to 1
  cartMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Retrieve the product ID from route params
    this.productId = this.route.snapshot.paramMap.get('id');
  
    // Fetch the product details from the backend
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(
        (response) => {
          this.product = response.product; // Assuming the API returns { product: {} }
          this.product.image_path = `http://localhost:3900/${this.product.image_path}`; // Construct full URL
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );
    }
  }

// In product-details.component.ts
addToCart(): void {
  if (this.product) {
    const userId = '724656b3-09c6-4801-b7f2-e4eb3569192e'; // Replace with actual logged-in user ID
    this.cartService.addProductToCart(userId, this.product.id, this.quantity).subscribe(
      () => {
        this.cartMessage = `${this.quantity} of ${this.product.name} added to cart!`;
        setTimeout(() => {
          this.cartMessage = ''; // Clear the cart message after 3 seconds
        }, 3000);
      },
      (error) => {
        console.error('Error adding product to cart:', error);
      }
    );
  }
}
}
