import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { AdminService } from '../../../services/admin.service';
import * as AOS from 'aos';

interface LowStockItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
}

interface Order {
  id: number;
  customer: string;
  date: Date;
  amount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
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
  totalItems: number = 1250;
  itemsInStock: number = 1087;
  todayOrders: number = 24;
  todayRevenue: number = 156750;

  // Chart data
  itemsByCategoryData: any;
  ordersByStatusData: any;
  chartOptions: any;

  // Low stock items
  lowStockItems: LowStockItem[] = [
    { id: 1, name: 'Wireless Earbuds', category: 'Electronics', currentStock: 3, reorderLevel: 10 },
    { id: 2, name: 'Smart Watch', category: 'Electronics', currentStock: 0, reorderLevel: 5 },
    { id: 3, name: 'Bluetooth Speaker', category: 'Electronics', currentStock: 2, reorderLevel: 8 },
    { id: 4, name: 'Laptop Bag', category: 'Accessories', currentStock: 4, reorderLevel: 10 },
    { id: 5, name: 'USB-C Cable', category: 'Accessories', currentStock: 5, reorderLevel: 15 },
    { id: 6, name: 'Wireless Mouse', category: 'Electronics', currentStock: 0, reorderLevel: 12 }
  ];

  // Recent orders
  recentOrders: Order[] = [
    { id: 10248, customer: 'John Smith', date: new Date(2023, 5, 12, 9, 30), amount: 12500, status: 'Delivered' },
    { id: 10249, customer: 'Sarah Johnson', date: new Date(2023, 5, 12, 10, 15), amount: 8750, status: 'Shipped' },
    { id: 10250, customer: 'Michael Brown', date: new Date(2023, 5, 12, 11, 45), amount: 15000, status: 'Processing' },
    { id: 10251, customer: 'Emily Davis', date: new Date(2023, 5, 12, 13, 20), amount: 6500, status: 'Pending' },
    { id: 10252, customer: 'David Wilson', date: new Date(2023, 5, 12, 14, 10), amount: 22000, status: 'Pending' },
    { id: 10253, customer: 'Lisa Anderson', date: new Date(2023, 5, 12, 15, 30), amount: 9800, status: 'Processing' }
  ];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
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

    // Initialize chart data
    this.initChartData();

    // Show notifications for low stock items
    this.showLowStockNotifications();

    // In a real application, you would fetch data from your service
    // this.fetchDashboardData();
  }

  private initChartData() {
    // Items by Category chart data
    this.itemsByCategoryData = {
      labels: ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys', 'Beauty'],
      datasets: [
        {
          data: [540, 325, 210, 75, 60, 40],
          backgroundColor: [
            '#42A5F5', // Blue
            '#66BB6A', // Green
            '#FFA726', // Orange
            '#26C6DA', // Cyan
            '#7E57C2', // Purple
            '#EC407A'  // Pink
          ],
          hoverBackgroundColor: [
            '#64B5F6', // Light Blue
            '#81C784', // Light Green
            '#FFB74D', // Light Orange
            '#4DD0E1', // Light Cyan
            '#9575CD', // Light Purple
            '#F06292'  // Light Pink
          ]
        }
      ]
    };

    // Orders by Status chart data
    this.ordersByStatusData = {
      labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      datasets: [
        {
          data: [15, 22, 18, 45],
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

  // In a real application, you would fetch data from your service
//   private fetchDashboardData() {
//     // Fetch total items
//     this.adminService.getItemCount().subscribe(count => {
//       this.totalItems = count;
//     });

//     // Fetch items in stock
//     this.adminService.getItemsInStockCount().subscribe(count => {
//       this.itemsInStock = count;
//     });

//     // Fetch today's orders
//     this.adminService.getTodayOrdersCount().subscribe(count => {
//       this.todayOrders = count;
//     });

//     // Fetch today's revenue
//     this.adminService.getTodayRevenue().subscribe(revenue => {
//       this.todayRevenue = revenue;
//     });

//     // Fetch low stock items
//     this.adminService.getLowStockItems().subscribe(items => {
//       this.lowStockItems = items;
//       this.showLowStockNotifications();
//     });

//     // Fetch recent orders
//     this.adminService.getRecentOrders().subscribe(orders => {
//       this.recentOrders = orders;
//     });

//     // Fetch items by category data for chart
//     this.adminService.getItemsByCategory().subscribe(data => {
//       this.itemsByCategoryData.labels = data.map((item: any) => item.category);
//       this.itemsByCategoryData.datasets[0].data = data.map((item: any) => item.count);
//     });

//     // Fetch orders by status data for chart
//     this.adminService.getOrdersByStatus().subscribe(data => {
//       this.ordersByStatusData.labels = data.map((item: any) => item.status);
//       this.ordersByStatusData.datasets[0].data = data.map((item: any) => item.count);
//     });
//   }
}
