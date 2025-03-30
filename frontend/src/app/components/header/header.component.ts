import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { ProductService } from '../../services/product.service'; // Changed from CategoriesService
import { Subscription, filter } from 'rxjs';
import { CartService } from '../../services/cart-service.service';
import { FilterService } from '../../services/filter.service';

interface NavItem {
  name: string;
  active: boolean;
  route?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartItemCount: number = 0;
  categories: any[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  private subscriptions = new Subscription();
  
  navItems: NavItem[] = [
    { name: 'Home', active: true, route: '/home' },
    { name: 'Hot Deals', active: false, route: '/deals' },
    { name: 'Categories', active: false, route: '/categories' },
    { name: 'Laptops', active: false, route: '/category/laptops' },
    { name: 'SmartPhones', active: false, route: '/category/smartphones' },
    { name: 'Cameras', active: false, route: '/category/cameras' },
    { name: 'Accessories', active: false, route: '/category/accessories' },
  ];

  constructor(
    private cartService: CartService,
    private productService: ProductService, // Changed from CategoriesService
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesFromProducts();
    this.setupRouteListener();
    this.setupCartSubscription();
    this.loadInitialCartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadCategoriesFromProducts(): void {
    this.subscriptions.add(
      this.productService.getAllProducts().subscribe({
        next: (response) => {
          // Extract unique categories from products
          const categoryMap = new Map<string, string>();
          
          if (response.products && response.products.length > 0) {
            response.products.forEach((product: { category_id: string; category_name: string; }) => {
              if (product.category_id && product.category_name) {
                categoryMap.set(product.category_id, product.category_name);
              }
            });
          }
          
          // Convert map to array and add 'All Categories' option
          this.categories = [
            { id: 'all', name: 'All Categories' },
            ...Array.from(categoryMap, ([id, name]) => ({ id, name }))
          ];
          
          this.updateNavItemsWithCategories();
        },
        error: (error) => console.error('Error loading products:', error)
      })
    );
  }

  onSearch(): void {
    // Trigger both filters
    this.filterService.setCategoryFilter(this.selectedCategory);
    this.filterService.setSearchQuery(this.searchQuery.trim().toLowerCase());
    
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    }
  }

  onCategoryChange(): void {
    this.filterService.setCategoryFilter(this.selectedCategory);
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    }
  }

  private loadInitialCartData(): void {
    this.subscriptions.add(
      this.cartService.getCartItems().subscribe({
        error: (err) => console.error('Initial cart load failed:', err)
      })
    );
  }

  private setupCartSubscription(): void {
    this.subscriptions.add(
      this.cartService.cartCount$.subscribe({
        next: (count) => this.cartItemCount = count,
        error: (err) => {
          console.error('Cart count error:', err);
          this.cartItemCount = 0;
        }
      })
    );
  }

  private updateNavItemsWithCategories(): void {
    const categoryNavItems = this.categories.slice(1, 5).map(category => ({
      name: category.name,
      active: false,
      route: `/category/${category.id}` // Using id since we don't have slug
    }));
    
    this.navItems = [...this.navItems.slice(0, 3), ...categoryNavItems];
  }

  private setupRouteListener(): void {
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const currentRoute = this.router.url;
        this.navItems = this.navItems.map(item => ({
          ...item,
          active: item.route ? currentRoute.startsWith(item.route) : false
        }));
      })
    );
  }
}