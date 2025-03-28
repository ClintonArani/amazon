import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3900/products';

  constructor(private http: HttpClient) {}

  addProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, productData);
  }
  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`);
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`);
  }
  updateProduct(productId: string, productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${productId}`, productData);
  }
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${productId}`);
  }
}