import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartProducts: any[] = [];
  totalAmount: number = 0;
  userId = '724656b3-09c6-4801-b7f2-e4eb3569192e'; // Replace with actual logged-in user ID

  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  // Fetch cart items for the user
  loadCartItems(): void {
    this.cartService.getCartItems(this.userId).subscribe(
      (response) => {
        this.cartProducts = response.items; // Assuming the API returns { items: [] }
        this.calculateTotal();
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
  }

  // Remove product from cart
  removeProductFromCart(cartItemId: string): void {
    this.cartService.removeProductFromCart(cartItemId).subscribe(
      () => {
        this.cartProducts = this.cartProducts.filter((item) => item.id !== cartItemId);
        this.calculateTotal();
      },
      (error) => {
        console.error('Error removing item from cart:', error);
      }
    );
  }

  // Perform checkout
  checkout(): void {
    this.orderService.checkout(this.userId).subscribe(
      () => {
        this.cartService.clearCart(); // Clear local cart
        this.cartProducts = [];
        this.totalAmount = 0;
        alert('Checkout successful!');
      },
      (error) => {
        console.error('Error during checkout:', error);
      }
    );
  }

  // Calculate total amount of all products in the cart
  calculateTotal(): void {
    this.totalAmount = this.cartProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  }
}