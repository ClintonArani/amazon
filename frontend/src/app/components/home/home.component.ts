import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoriesService } from '../../services/categories.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { FilterService } from '../../services/filter.service';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  categories: any[] = []; 
  allProducts: any[] = [];
  filteredProducts: any[] = [];

  currentPage = 1;
  itemsPerPage = 20; 
  totalPages = 1;

  items = [
    {title: 'Laptop', image: 'assets/shop01.png' },
    {title: 'Camera', image: 'assets/shop02.png' },
    {title: 'Headphone', image: 'assets/shop03.png' }
  ]

  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesAndProducts();
    this.setupFilterListeners();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadCategoriesAndProducts(): void {
    // Fetch categories first
    this.categoriesService.getAllCategories().subscribe(
      (categoriesResponse) => {
        this.categories = categoriesResponse.categories;

        // Then fetch products
        this.productService.getAllProducts().subscribe(
          (productsResponse) => {
            this.allProducts = productsResponse.products.map((product: any) => ({
              ...product,
              image_path: `http://localhost:3900/${product.image_path}`,
              category_name: this.getCategoryName(product.category_id) // Add category_name here
            }));
            this.filteredProducts = [...this.allProducts];
            this.updatePagination();
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

  getCategoryName(categoryId: string): string {
    if (!categoryId) return 'Unknown';
    
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  setupFilterListeners(): void {
    this.subscriptions.add(
      combineLatest([
        this.filterService.searchQuery$,
        this.filterService.categoryFilter$
      ]).subscribe(([searchQuery, categoryId]) => {
        this.applyFilters(searchQuery, categoryId);
      })
    );
  }

  applyFilters(searchQuery: string, categoryId: string): void {
    this.filteredProducts = this.allProducts.filter(product => {
      const categoryMatch = categoryId === 'all' || product.category_id === categoryId;
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        this.getCategoryName(product.category_id).toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
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