import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3900/products';
  private categoryApiUrl = 'http://localhost:3900/categories';

  constructor(private http: HttpClient) {}

  // Add a new product with image upload
  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, productData);
  }

  // Get all products
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }

  // Get a single product by ID
  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }

  // Update a product with image upload
  updateProduct(productId: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${productId}`, productData);
  }

  // Delete a product
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${productId}`);
  }

  // Get all categories
  getAllCategories(): Observable<any> {
    return this.http.get(`${this.categoryApiUrl}/all`);
  }
}