import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  activeTab: string = 'overview';
  isSidebarVisible: boolean = false;
  isDarkMode: boolean = false;
  isProfileDropdownVisible: boolean = false;
  notificationsCount: number = 3;
  isLoading: boolean = false;
  userFullName!: string;
  userEmail: string = '';
  userAvatar: string = 'assets/image2.png'; // Default avatar

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.simulateLoading();
    this.simulateRealTimeNotifications();
    this.loadUserFromToken();
  }

  loadUserFromToken() {
    const userData = this.userService.getCurrentUserFromToken();
    if (userData) {
      this.userFullName = `${userData.firstName} ${userData.lastName}`.trim();
      
      // You can add more fields as needed
    }
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log(response.message);
      },
      error: (err) => {
        console.error('Logout failed:', err);
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.hideSidebarOnSmallScreen();
  }

  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  hideSidebarOnSmallScreen() {
    if (window.innerWidth <= 768) {
      this.isSidebarVisible = false;
    }
  }

  hideSidebarOnOutsideClick() {
    if (this.isSidebarVisible && window.innerWidth <= 768) {
      this.isSidebarVisible = false;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  toggleProfileDropdown() {
    this.isProfileDropdownVisible = !this.isProfileDropdownVisible;
  }

  showNotifications() {
    alert(`You have ${this.notificationsCount} new notifications.`);
  }

  simulateLoading() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  simulateRealTimeNotifications() {
    setInterval(() => {
      this.notificationsCount = Math.floor(Math.random() * 10);
    }, 5000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    if (window.innerWidth > 768) {
      this.isSidebarVisible = false;
    }
  }
}