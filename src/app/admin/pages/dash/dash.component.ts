import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import * as AOS from 'aos';
import { DashboardService } from '../../../services/dashboard.service';

interface LowStockItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
}

interface OrdersByStatus {
  status: string;
  count: number;
}

interface RevenueByMonth {
  month: string;
  revenue: number;
  previousYearRevenue: number;
}

interface DashboardData {
  summary: {
    totalItems: number;
    itemsInStock: number;
    todayOrders: number;
    todayRevenue: number;
  };
  charts: {
    ordersByStatus: OrdersByStatus[];
    revenueByMonth: RevenueByMonth[];
  };
  lowStockItems: LowStockItem[];
}

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
  providers: [MessageService]
})
export class DashComponent implements OnInit {
  // Breadcrumb
  items: MenuItem[] = [];
  home: MenuItem = {};

  // Summary metrics
  totalItems: number = 0;
  itemsInStock: number = 0;
  todayOrders: number = 0;
  todayRevenue: number = 0;

  // Chart data
  ordersByStatusData: any;
  revenueByMonthData: any;
  chartOptions: any;

  // Low stock items
  lowStockItems: LowStockItem[] = [];

  // Loading state
  loading: boolean = true;

  constructor(
    private messageService: MessageService,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });

    // Initialize breadcrumb
    this.items = [
      { label: 'EMart' },
      { label: 'Admin' },
      { label: 'Dashboard' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/admin/dash' };

    // Initialize chart options
    this.initChartOptions();
    
    // Fetch dashboard data
    this.fetchDashboardData();
  }

  private initChartOptions() {
    // Chart options
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.label || '';
              let value = context.raw || 0;
              let total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              let percentage = Math.round((value / total) * 100);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '60%',
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private fetchDashboardData() {
    this.loading = true;
    
    this.dashboardService.getAllDashboardData().subscribe({
      next: (response: any) => {
        if (response && response.status && response.payload && response.payload.length > 0) {
          const dashboardData: DashboardData = response.payload[0];
          
          // Map summary data
          this.totalItems = dashboardData.summary.totalItems;
          this.itemsInStock = dashboardData.summary.itemsInStock;
          this.todayOrders = dashboardData.summary.todayOrders;
          this.todayRevenue = dashboardData.summary.todayRevenue;
          
          // Map low stock items
          this.lowStockItems = dashboardData.lowStockItems;
          
          // Map orders by status chart data
          this.prepareOrdersByStatusChart(dashboardData.charts.ordersByStatus);
          
          // Map revenue by month chart data
          this.prepareRevenueByMonthChart(dashboardData.charts.revenueByMonth);
          
          // Show low stock notifications
          this.showLowStockNotifications();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load dashboard data',
            life: 5000
          });
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard data',
          life: 5000
        });
        this.loading = false;
      }
    });
  }

  private prepareOrdersByStatusChart(ordersByStatus: OrdersByStatus[]) {
    // Prepare data for orders by status chart
    const labels = ordersByStatus.map(item => this.capitalizeFirstLetter(item.status));
    const data = ordersByStatus.map(item => item.count);
    
    this.ordersByStatusData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#42A5F5', // Blue for Pending
            '#FFA726', // Orange for Processing
            '#7E57C2', // Purple for Shipped
            '#66BB6A'  // Green for Delivered
          ],
          hoverBackgroundColor: [
            '#64B5F6', // Light Blue
            '#FFB74D', // Light Orange
            '#9575CD', // Light Purple
            '#81C784'  // Light Green
          ]
        }
      ]
    };
  }

  private prepareRevenueByMonthChart(revenueByMonth: RevenueByMonth[]) {
    // Prepare data for revenue by month chart
    this.revenueByMonthData = {
      labels: revenueByMonth.map(item => item.month),
      datasets: [
        {
          label: 'Current Year Revenue',
          data: revenueByMonth.map(item => item.revenue),
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        },
        {
          label: 'Previous Year Revenue',
          data: revenueByMonth.map(item => item.previousYearRevenue),
          fill: false,
          borderColor: '#FFA726',
          tension: 0.4
        }
      ]
    };
  }

  private showLowStockNotifications() {
    // Show notifications for items that are out of stock or below reorder level
    setTimeout(() => {
      const outOfStockItems = this.lowStockItems.filter(item => item.currentStock === 0);
      if (outOfStockItems.length > 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Out of Stock Alert',
          detail: `${outOfStockItems.length} items are currently out of stock!`,
          life: 5000
        });
      }
      
      setTimeout(() => {
        const lowStockItems = this.lowStockItems.filter(item => 
          item.currentStock > 0 && item.currentStock <= item.reorderLevel
        );
        if (lowStockItems.length > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Low Stock Alert',
            detail: `${lowStockItems.length} items are below reorder level!`,
            life: 5000
          });
        }
      }, 2000);
    }, 1000);
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}