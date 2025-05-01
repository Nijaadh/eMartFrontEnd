import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService, MenuItem } from 'primeng/api';
import { ADMIN_MENU, USER_MENU } from '../menu/menu';
import * as AOS from 'aos';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  icon: string;
  iconClass: string;
}

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = true;
  menuList: { path: string; icon: string; label: string }[] = [];
  currentDate: Date = new Date();
  userRole: string = '';
  userName: string = '';
  userInitials: string = '';
  pageTitle: string = 'Dashboard';
  notificationCount: number = 0;
  showNotificationsPanel: boolean = false;
  notifications: Notification[] = [];
  
  // Breadcrumb items
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  
  // User dropdown menu
  userMenuItems: MenuItem[] = [];
  
  private routeSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 50
    });

    // Get user role and info from localStorage
    this.userRole = localStorage.getItem('role') || 'User';
    this.userName = localStorage.getItem('username') || 'Admin User';
    this.setUserInitials();
    this.menuList = this.userRole === 'Admin' ? ADMIN_MENU : USER_MENU;

    // Check if sidebar state is saved in localStorage
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState) {
      this.sidebarVisible = savedSidebarState === 'expanded';
    } else {
      // Default to collapsed on mobile, expanded on desktop
      this.sidebarVisible = window.innerWidth > 1024;
    }

    // Setup user menu items
    this.setupUserMenu();
    
    // Setup mock notifications
    this.setupMockNotifications();
    
    // Setup route change listener for breadcrumbs and page title
    this.setupRouteListener();
    
    // Show welcome toast
    this.showWelcomeMessage();
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
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
      this.router.navigate(['/login']);
    }, 1000);
  }

  showNotifications(): void {
    this.showNotificationsPanel = true;
  }
  
  clearNotifications(): void {
    this.notifications = [];
    this.notificationCount = 0;
    this.messageService.add({
      severity: 'success',
      summary: 'Notifications Cleared',
      detail: 'All notifications have been cleared.',
      life: 3000
    });
    this.showNotificationsPanel = false;
  }

  private showWelcomeMessage(): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Welcome Back!',
      detail: `Hello ${this.userName}, welcome to EMart Admin Panel.`,
      life: 5000
    });
  }
  
  private setUserInitials(): void {
    if (this.userName) {
      const names = this.userName.split(' ');
      if (names.length > 1) {
        this.userInitials = (names[0][0] + names[1][0]).toUpperCase();
      } else {
        this.userInitials = names[0].substring(0, 2).toUpperCase();
      }
    } else {
      this.userInitials = 'AU'; // Default: Admin User
    }
  }
  
  private setupUserMenu(): void {
    this.userMenuItems = [
      {
        label: this.userName,
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => this.router.navigate(['/profile'])
          },
          {
            label: 'Settings',
            icon: 'pi pi-cog',
            command: () => this.router.navigate(['/settings'])
          },
          { separator: true },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => this.logout()
          }
        ]
      }
    ];
  }
  
  private setupMockNotifications(): void {
    // Mock notifications for demonstration
    this.notifications = [
      {
        id: 1,
        title: 'New Order Received',
        message: 'Order #12345 has been placed and is waiting for approval.',
        time: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        icon: 'pi pi-shopping-cart',
        iconClass: 'text-blue-500'
      },
      {
        id: 2,
        title: 'Payment Confirmed',
        message: 'Payment of $1,299.00 for Order #12340 has been confirmed.',
        time: new Date(Date.now() - 86400000), // 1 day ago
        read: false,
        icon: 'pi pi-check-circle',
        iconClass: 'text-green-500'
      },
      {
        id: 3,
        title: 'System Update',
        message: 'System maintenance scheduled for tonight at 2:00 AM.',
        time: new Date(Date.now() - 172800000), // 2 days ago
        read: true,
        icon: 'pi pi-info-circle',
        iconClass: 'text-yellow-500'
      }
    ];
    
    // Count unread notifications
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }
  
  private setupRouteListener(): void {
    this.routeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        // Update page title based on route data
        this.pageTitle = data['title'] || 'Dashboard';
        
        // Build breadcrumb from route data
        if (data['breadcrumb']) {
          this.breadcrumbItems = data['breadcrumb'];
        } else {
          // Default breadcrumb based on page title
          this.breadcrumbItems = [
            { label: this.pageTitle }
          ];
        }
      });
  }
}