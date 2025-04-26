import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ADMIN_MENU, USER_MENU } from '../menu/menu';
import * as AOS from 'aos';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  sidebarVisible: boolean = true;
  menuList: { path: string; icon: string; label: string }[] = [];
  currentDate: Date = new Date();
  userRole: string = '';
  
  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
    
    // Get user role from localStorage
    this.userRole = localStorage.getItem('role') || 'User';
    this.menuList = this.userRole === 'Admin' ? ADMIN_MENU : USER_MENU;
    
    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState) {
      this.sidebarVisible = savedSidebarState === 'expanded';
    }
    
    // Show welcome toast
    this.showWelcomeMessage();
  }
  
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    // Save sidebar state to localStorage
    localStorage.setItem('sidebarState', this.sidebarVisible ? 'expanded' : 'collapsed');
  }

  logout(): void {
    // Show confirmation toast
    this.messageService.add({
      severity: 'info',
      summary: 'Logging Out',
      detail: 'You have been successfully logged out.',
      life: 3000
    });
    
    // Clear localStorage and redirect after a short delay
    setTimeout(() => {
      localStorage.clear();
      this.router.navigate(['/home']);
    }, 1000);
  }
  
  private showWelcomeMessage(): void {
    const username = localStorage.getItem('username') || 'Admin';
    this.messageService.add({
      severity: 'success',
      summary: 'Welcome Back!',
      detail: `Hello ${username}, welcome to EMart Admin Panel.`,
      life: 5000
    });
  }
}
