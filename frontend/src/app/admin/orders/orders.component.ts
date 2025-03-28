import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  statuses: string[] = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'];
  filterForm: FormGroup;
  currentPage = 1;
  itemsPerPage = 10;
  selectedOrder: any = null;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      status: ['All'],
      dateFrom: [''],
      dateTo: [''],
      search: ['']
    });
  }

  ngOnInit(): void {
    // Mock data - replace with API call
    this.orders = [
      { id: '#1001', customer: 'John Doe', email: 'john@example.com', date: '2023-05-15', amount: 125.99, status: 'Processing', items: [{name: 'Wireless Headphones', price: 99.99, quantity: 1}, {name: 'Phone Case', price: 25.99, quantity: 1}] },
      { id: '#1002', customer: 'Jane Smith', email: 'jane@example.com', date: '2023-05-14', amount: 89.50, status: 'Shipped', items: [{name: 'Smart Watch', price: 89.50, quantity: 1}] },
      { id: '#1003', customer: 'Robert Johnson', email: 'robert@example.com', date: '2023-05-14', amount: 234.75, status: 'Delivered', items: [{name: 'Bluetooth Speaker', price: 78.25, quantity: 3}] },
      { id: '#1004', customer: 'Emily Davis', email: 'emily@example.com', date: '2023-05-13', amount: 56.25, status: 'Processing', items: [{name: 'USB Cable', price: 12.50, quantity: 2}, {name: 'Power Bank', price: 31.25, quantity: 1}] },
      { id: '#1005', customer: 'Michael Wilson', email: 'michael@example.com', date: '2023-05-12', amount: 178.99, status: 'Shipped', items: [{name: 'Laptop Backpack', price: 59.99, quantity: 1}, {name: 'Wireless Mouse', price: 29.99, quantity: 1}, {name: 'Keyboard', price: 89.99, quantity: 1}] },
      { id: '#1006', customer: 'Sarah Brown', email: 'sarah@example.com', date: '2023-05-11', amount: 45.99, status: 'Delivered', items: [{name: 'Phone Stand', price: 15.99, quantity: 1}, {name: 'Screen Protector', price: 9.99, quantity: 2}] },
      { id: '#1007', customer: 'David Miller', email: 'david@example.com', date: '2023-05-10', amount: 199.99, status: 'Cancelled', items: [{name: 'Gaming Headset', price: 199.99, quantity: 1}] },
      { id: '#1008', customer: 'Lisa Taylor', email: 'lisa@example.com', date: '2023-05-09', amount: 75.50, status: 'Refunded', items: [{name: 'Fitness Tracker', price: 75.50, quantity: 1}] },
      { id: '#1009', customer: 'James Anderson', email: 'james@example.com', date: '2023-05-08', amount: 120.00, status: 'Delivered', items: [{name: 'External Hard Drive', price: 120.00, quantity: 1}] },
      { id: '#1010', customer: 'Emma Thomas', email: 'emma@example.com', date: '2023-05-07', amount: 34.99, status: 'Processing', items: [{name: 'Earbuds', price: 34.99, quantity: 1}] }
    ];
    this.filteredOrders = [...this.orders];
  }

  // Getter for display range end
  get displayRangeEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredOrders.length);
  }

  // Getter for paginated orders
  get paginatedOrders(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Getter for total pages
  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  // Getter for page numbers
  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  applyFilters(): void {
    const formValue = this.filterForm.value;
    this.filteredOrders = this.orders.filter(order => {
      // Status filter
      if (formValue.status !== 'All' && order.status !== formValue.status) {
        return false;
      }
      
      // Date range filter
      if (formValue.dateFrom && new Date(order.date) < new Date(formValue.dateFrom)) {
        return false;
      }
      if (formValue.dateTo && new Date(order.date) > new Date(formValue.dateTo)) {
        return false;
      }
      
      // Search filter
      if (formValue.search) {
        const searchTerm = formValue.search.toLowerCase();
        if (!order.id.toLowerCase().includes(searchTerm) && 
            !order.customer.toLowerCase().includes(searchTerm) && 
            !order.email.toLowerCase().includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.filterForm.reset({
      status: 'All',
      dateFrom: '',
      dateTo: '',
      search: ''
    });
    this.filteredOrders = [...this.orders];
    this.currentPage = 1;
  }

  updateOrderStatus(order: any, newStatus: string): void {
    order.status = newStatus;
    // Here you would typically call your backend service to update the order status
    console.log(`Order ${order.id} status updated to ${newStatus}`);
  }

  viewOrderDetails(order: any): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  changePage(page: number): void {
    this.currentPage = page;
  }
}