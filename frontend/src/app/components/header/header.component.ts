import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart-service.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;
  categories: any[] = []; // Array to store fetched categories
  
  // Define navigation items
  navItems = [
    { name: 'Home', active: true, route: '/home' },
    { name: 'Hot Deals', active: false },
    { name: 'Categories', active: false },
    { name: 'Laptops', active: false },
    { name: 'SmartPhones', active: false },
    { name: 'Cameras', active: false },
    { name: 'Accessories', active: false },
  ];

  constructor(
    private cartService: CartService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    
  }
   // Fetch categories from the backend
   loadCategories(): void {
    this.categoriesService.getAllCategories().subscribe(
      (response) => {
        this.categories = response.categories; // Assuming the API returns { categories: [] }
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }
 
}