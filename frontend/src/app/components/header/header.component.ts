// header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
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
  selectedCategory: string = 'all'; // Default to 'all' categories
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
    private categoriesService: CategoriesService,
    private router: Router,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.setupRouteListener();
    this.setupCartSubscription();
    this.loadInitialCartData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onSearch(): void {
    if (this.selectedCategory) {
      this.filterService.setCategoryFilter(this.selectedCategory);
    }
    if (this.searchQuery) {
      this.filterService.setSearchQuery(this.searchQuery);
    }
    
    // Navigate to home if not already there
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']);
    }
    
    // Reset search (optional)
    // this.searchQuery = '';
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

  private loadCategories(): void {
    this.subscriptions.add(
      this.categoriesService.getAllCategories().subscribe({
        next: (response) => {
          // Add 'All Categories' option
          this.categories = [{ id: 'all', name: 'All Categories' }, ...(response.categories || [])];
          this.updateNavItemsWithCategories();
        },
        error: (error) => console.error('Error loading categories:', error)
      })
    );
  }

  private updateNavItemsWithCategories(): void {
    const categoryNavItems = this.categories.slice(1, 5).map(category => ({
      name: category.name,
      active: false,
      route: `/category/${category.slug || category.id}`
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