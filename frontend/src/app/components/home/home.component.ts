import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoriesService } from '../../services/categories.service';
import { HeaderComponent } from "../header/header.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: any[] = []; // Array to store fetched categories
  products: any[] = []; // Array to store fetched products

  currentPage = 1;
  itemsPerPage = 20; // 4 rows * 5 products per row
  totalPages = 1;

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesAndProducts();
  }

  // Fetch categories and products
  loadCategoriesAndProducts(): void {
    // Fetch categories
    this.categoriesService.getAllCategories().subscribe(
      (categoriesResponse) => {
        this.categories = categoriesResponse.categories;

        // Fetch products
        this.productService.getAllProducts().subscribe(
          (productsResponse) => {
            this.products = productsResponse.products.map((product: any) => ({
              ...product,
              image_path: `http://localhost:3900/${product.image_path}`,
              category_name: this.getCategoryName(product.category_id) // Map category ID to category name
              
            }));
            this.totalPages = Math.ceil(this.products.length / this.itemsPerPage);
          },
          (productsError) => {
            console.error('Error loading products:', productsError);
          }
        );
      },
      (categoriesError) => {
        console.error('Error loading categories:', categoriesError);
      }
    );
  }

  // Get category name by category ID
  getCategoryName(categoryId: string): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  // Navigate to product details
  goToProductDetails(product: any): void {
    this.router.navigate(['/product-details', product.id]);
  }

  // Pagination logic
  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
}