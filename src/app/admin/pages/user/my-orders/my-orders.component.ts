import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as AOS from 'aos';
import { MessageService } from 'primeng/api';

interface ItemDetail {
  id: number;
  name: string;
  description: string;
  unitPrice: number;
  image: string;
  discount: number;
  quantity: number;
  category: string;
  commonStatus: string;
  salesCount: number | null;
  reOrderLevel: number;
  subCategoryId: number | null;
  categoryId: number | null;
  subCategoryName: string | null;
  itemCount: number;
  categoryName: string | null;
}

interface Order {
  id: number;
  createdAt: string;
  receiverAddress: string;
  totalPrice: string;
  zip: string;
  commonStatus: string;
  orderStatus: string;
  paymentStatus: string;
  userId: string;
  itemQuantities: { [key: string]: number } | null;
  itemDetails: ItemDetail[];
}

interface ApiResponse {
  status: boolean;
  errorMessages: string[];
  payload: Order[][];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss',
  providers: [MessageService]
})
export class MyOrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  expandedOrderId: number | null = null;
  
  // Order status colors for badges
  statusColors = {
    'PENDING': 'warning',
    'PROCESSING': 'info',
    'SHIPPED': 'primary',
    'DELIVERED': 'success',
    'CANCELLED': 'danger'
  };

  // PrimeNG DataView layout options
  layout: 'list' | 'grid' = 'list';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
    
    this.fetchOrders();
  }

  fetchOrders(): void {
    try {
      // For development, using mock data
      this.mockOrders();
      
      // When ready for API integration, uncomment this:
      /*
      this.http.get<ApiResponse>('your-api-endpoint/orders').subscribe({
        next: (response) => {
          if (response.status && response.payload && response.payload.length > 0) {
            this.orders = response.payload[0];
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load orders. Please try again later.';
          this.loading = false;
          console.error('Error fetching orders:', err);
          // Fallback to mock data
          this.mockOrders();
        }
      });
      */
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      this.error = 'An unexpected error occurred.';
      this.loading = false;
    }
  }

  mockOrders(): void {
    try {
      // Mock data that matches the exact structure of your JSON response
      const mockResponse: ApiResponse = {
        "status": true,
        "errorMessages": [],
        "payload": [
          [
            {
              "id": 196,
              "createdAt": "2025-05-08T01:13:38.5047155",
              "receiverAddress": "No.14 , thondaman rd, jafna",
              "totalPrice": "400000.0",
              "zip": "11875",
              "commonStatus": "ACTIVE",
              "orderStatus": "PROCESSING",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "19": 2
              },
              "itemDetails": [
                {
                  "unitPrice": 200000.0,
                  "image": "image 64",
                  "salesCount": 1,
                  "reOrderLevel": 8,
                  "quantity": 1,
                  "description": "Apple iMac 18.2 A1418 21,5'' LED 4096x2304 IPS i5-7400 3.0GHz 16GB 500GB SSD Radeon Pro 555 OSX",
                  "discount": 6.0,
                  "subCategoryId": null,
                  "categoryName": null,
                  "itemCount": 75,
                  "subCategoryName": null,
                  "name": " Apple iMac",
                  "commonStatus": "ACTIVE",
                  "id": 19,
                  "category": "Electronic",
                  "categoryId": null
                }
              ]
            },
            {
              "id": 213,
              "createdAt": "2025-05-08T01:33:45.8815184",
              "receiverAddress": "No.14 , thondaman rd, jafna",
              "totalPrice": "200000.0",
              "zip": "11875",
              "commonStatus": "ACTIVE",
              "orderStatus": "PENDING",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "19": 1
              },
              "itemDetails": [
                {
                  "unitPrice": 200000.0,
                  "image": "image 64",
                  "salesCount": 1,
                  "reOrderLevel": 8,
                  "quantity": 1,
                  "description": "Apple iMac 18.2 A1418 21,5'' LED 4096x2304 IPS i5-7400 3.0GHz 16GB 500GB SSD Radeon Pro 555 OSX",
                  "discount": 6.0,
                  "subCategoryId": null,
                  "categoryName": null,
                  "itemCount": 75,
                  "subCategoryName": null,
                  "name": " Apple iMac",
                  "commonStatus": "ACTIVE",
                  "id": 19,
                  "category": "Electronic",
                  "categoryId": null
                }
              ]
            },
            {
              "id": 215,
              "createdAt": "2025-05-08T01:39:02.276294",
              "receiverAddress": "No.14 , thondaman rd, jafna",
              "totalPrice": "200000.0",
              "zip": "11875",
              "commonStatus": "ACTIVE",
              "orderStatus": "PENDING",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "19": 1
              },
              "itemDetails": [
                {
                  "unitPrice": 200000.0,
                  "image": "image base 64",
                  "salesCount": 1,
                  "reOrderLevel": 8,
                  "quantity": 1,
                  "description": "Apple iMac 18.2 A1418 21,5'' LED 4096x2304 IPS i5-7400 3.0GHz 16GB 500GB SSD Radeon Pro 555 OSX",
                  "discount": 6.0,
                  "subCategoryId": null,
                  "categoryName": null,
                  "itemCount": 75,
                  "subCategoryName": null,
                  "name": " Apple iMac",
                  "commonStatus": "ACTIVE",
                  "id": 19,
                  "category": "Electronic",
                  "categoryId": null
                }
              ]
            },
            {
              "id": 217,
              "createdAt": "2025-05-08T01:40:10.1958466",
              "receiverAddress": "No.14 , thondaman",
              "totalPrice": "200000.0",
              "zip": "88888",
              "commonStatus": "ACTIVE",
              "orderStatus": "PENDING",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "19": 1
              },
              "itemDetails": [
                {
                  "unitPrice": 200000.0,
                  "image": "image 64",
                  "salesCount": 1,
                  "reOrderLevel": 8,
                  "quantity": 1,
                  "description": "Apple iMac 18.2 A1418 21,5'' LED 4096x2304 IPS i5-7400 3.0GHz 16GB 500GB SSD Radeon Pro 555 OSX",
                  "discount": 6.0,
                  "subCategoryId": null,
                  "categoryName": null,
                  "itemCount": 75,
                  "subCategoryName": null,
                  "name": " Apple iMac",
                  "commonStatus": "ACTIVE",
                  "id": 19,
                  "category": "Electronic",
                  "categoryId": null
                }
              ]
            },
            {
              "id": 219,
              "createdAt": "2025-05-10T01:28:33.7851705",
              "receiverAddress": "No. 61/29 Rupasinghe Garden, Thihariya, Kalagedihena.",
              "totalPrice": "300.0",
              "zip": "11875",
              "commonStatus": "ACTIVE",
              "orderStatus": "SHIPPED",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "22": 1
              },
              "itemDetails": [
                {
                  "unitPrice": 300.0,
                  "image": "image base 64",
                  "salesCount": 2,
                  "reOrderLevel": 40,
                  "quantity": 1,
                  "description": "Biscolata Minis Wafer Dark Chocolate 117gm",
                  "discount": 8.0,
                  "subCategoryId": null,
                  "categoryName": null,
                  "itemCount": 33,
                  "subCategoryName": null,
                  "name": "Minis Wafer",
                  "commonStatus": "ACTIVE",
                  "id": 22,
                  "category": "Foods",
                  "categoryId": null
                }
              ]
            },
            {
              "id": 226,
              "createdAt": "2025-05-15T00:06:01.7149008",
              "receiverAddress": "No. 61/29 Rupasinghe Garden, Thihariya, Kalagedihena.",
              "totalPrice": "50570.0",
              "zip": "11875",
              "commonStatus": "ACTIVE",
              "orderStatus": "PENDING",
              "paymentStatus": "PAID",
              "userId": "190",
              "itemQuantities": {
                "195": 1,
                "191": 1
              },
              "itemDetails": [
                {
                  "unitPrice": 49000.0,
                  "image": "image base 64",
                  "salesCount": null,
                  "reOrderLevel": 20,
                  "quantity": 1,
                  "description": "Good Phone",
                  "discount": 7.0,
                  "subCategoryId": 168,
                  "categoryName": "Mobile",
                  "itemCount": 40,
                  "subCategoryName": "Tablet ",
                  "name": "Samsung S4 new",
                  "commonStatus": "ACTIVE",
                  "id": 191,
                  "category": "166",
                  "categoryId": 166
                },
                {
                  "unitPrice": 570.0,
                  "image": "image base 64",
                  "salesCount": null,
                  "reOrderLevel": 4,
                  "quantity": 1,
                  "description": "good",
                  "discount": 0.0,
                  "subCategoryId": 169,
                  "categoryName": "Electric",
                  "itemCount": 9,
                  "subCategoryName": "Casset",
                  "name": "wire cutter new",
                  "commonStatus": "ACTIVE",
                  "id": 195,
                  "category": "110",
                  "categoryId": 110
                }
              ]
            }
          ]
        ]
      };

      this.orders = mockResponse.payload[0];
      this.loading = false;
      console.log('Mock orders loaded:', this.orders.length);
    } catch (error) {
      console.error('Error in mockOrders:', error);
      this.error = 'Failed to load mock orders.';
      this.loading = false;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getStatusClass(status: string): string {
    return this.statusColors[status as keyof typeof this.statusColors] || 'secondary';
  }

  getStatusSeverity(status: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined {
    switch(status) {
      case 'PENDING': return 'warning';
      case 'PROCESSING': return 'info';
      case 'SHIPPED': return 'info'; // Changed from 'primary' which is not a valid severity
      case 'DELIVERED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  }

  getTotalItems(order: Order): number {
    if (!order.itemQuantities) {
      return 0;
    }
    return Object.values(order.itemQuantities).reduce((a, b) => a + b, 0);
  }

  toggleOrderDetails(orderId: number): void {
    if (this.expandedOrderId === orderId) {
      this.expandedOrderId = null;
    } else {
      this.expandedOrderId = orderId;
    }
  }

  trackOrder(order: Order): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Track Order',
      detail: `Tracking order #${order.id}`,
      life: 3000
    });
  }

  cancelOrder(order: Order): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Cancel Order',
      detail: `Cancellation request for order #${order.id} has been submitted`,
      life: 3000
    });
  }

  viewOrderDetails(order: Order): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Order Details',
      detail: `Viewing details for order #${order.id}`,
      life: 3000
    });
  }

   calculateDiscountedPrice(price: number, discount: number): number {
    return price - (price * (discount / 100));
  }

  // Helper method to safely get item quantity
  getItemQuantity(order: Order, itemId: number): number {
    if (!order.itemQuantities) {
      return 0;
    }
    return order.itemQuantities[itemId.toString()] || 0;
  }

  // Helper method to calculate total price of an item including quantity
  calculateItemTotal(item: ItemDetail, order: Order): number {
    const quantity = this.getItemQuantity(order, item.id);
    const discountedPrice = this.calculateDiscountedPrice(item.unitPrice, item.discount || 0);
    return discountedPrice * quantity;
  }

  // Helper method to get order status text for display
  getOrderStatusText(status: string): string {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  // Helper method to check if an order can be cancelled
  canCancelOrder(order: Order): boolean {
    return order.orderStatus === 'PENDING';
  }

  // Helper method to check if an order can be tracked
  canTrackOrder(order: Order): boolean {
    return ['PROCESSING', 'SHIPPED'].includes(order.orderStatus);
  }

  // Helper method to get a readable date
  getReadableDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      return 'Today';
    } else if (diffDays <= 2) {
      return 'Yesterday';
    } else {
      return this.formatDate(dateString);
    }
  }
}
