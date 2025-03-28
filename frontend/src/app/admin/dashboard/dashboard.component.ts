import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, TooltipItem, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 1245;
  totalProducts: number = 356;
  activeUsers: number = 892;
  totalOrders: number = 543;
  recentOrders: any[] = [];
  topProducts: any[] = [];
  activeInactiveUsers = {
    active: 892,
    inactive: 353
  };
  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.initCharts();
    this.recentOrders = [
      { id: '#1001', customer: 'John Doe', date: '2023-05-15', amount: 125.99, status: 'Processing' },
      { id: '#1002', customer: 'Jane Smith', date: '2023-05-14', amount: 89.50, status: 'Shipped' },
      { id: '#1003', customer: 'Robert Johnson', date: '2023-05-14', amount: 234.75, status: 'Delivered' },
      { id: '#1004', customer: 'Emily Davis', date: '2023-05-13', amount: 56.25, status: 'Processing' },
      { id: '#1005', customer: 'Michael Wilson', date: '2023-05-12', amount: 178.99, status: 'Shipped' }
    ];

    this.topProducts = [
      { name: 'Wireless Headphones', sales: 245, revenue: 12250 },
      { name: 'Smart Watch', sales: 189, revenue: 9450 },
      { name: 'Bluetooth Speaker', sales: 156, revenue: 7800 },
      { name: 'Laptop Backpack', sales: 132, revenue: 3960 },
      { name: 'Phone Charger', sales: 120, revenue: 1200 }
    ];
  }

  initCharts(): void {
    this.createSalesChart();
    this.createUserActivityChart();
    this.createRevenueChart();
  }

  createSalesChart(): void {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
          label: 'Monthly Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  }

  createUserActivityChart(): void {
    const ctx = document.getElementById('userActivityChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Active Users',
          data: [120, 190, 170, 210, 180, 250, 220],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Other'],
        datasets: [{
          label: 'Revenue by Category',
          data: [30000, 15000, 12000, 8000, 5000],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          }
        }
      }
    });
  }
  createUserStatusChart(): void {
    const ctx = document.getElementById('userStatusChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [{
          data: [this.activeInactiveUsers.active, this.activeInactiveUsers.inactive],
          backgroundColor: [
            'rgba(40, 167, 69, 0.8)',
            'rgba(220, 53, 69, 0.8)'
          ],
          borderColor: [
            'rgba(40, 167, 69, 1)',
            'rgba(220, 53, 69, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'pie'>) => {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  updateOrderStatus(order: any, newStatus: string): void {
    order.status = newStatus;
    // Here you would typically call your backend service to update the order status
    console.log(`Order ${order.id} status updated to ${newStatus}`);
  }
}