import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:3900/cart-items';
  private cartItems: Product[] = [];

  constructor(private http: HttpClient) {}

  // Add product to cart
  addProductToCart(userId: string, productId: string, quantity: number): Observable<any> {
    const payload = {
      user_id: userId,
      product_id: productId,
      quantity: quantity,
    };
    return this.http.post(`${this.apiUrl}/add`, payload);
  }

  // Remove product from cart
  removeProductFromCart(cartItemId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${cartItemId}`);
  }

  // Get cart items for a user
  getCartItems(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/items/${userId}`);
  }



  // Clear the cart (local only)
  clearCart(): void {
    this.cartItems = [];
  }
}