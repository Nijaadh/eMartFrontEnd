import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { OrderService } from '../../../../services/order.service';
import { Order } from '../../../../admin/model/Order';
import { OrderItem } from '../../../../admin/model/OrderItem'; // Corrected path


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  // Breadcrumb items
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  
  // Orders arrays by status
  fetchAllOrdersList: Order[] = [];
  pendingOrders: Order[] = [];
  processingOrders: Order[] = [];
  shippedOrders: Order[] = [];
  deliveredOrders: Order[] = [];
  cancelledOrders: Order[] = [];
  
  // UI state
  loading: boolean = false;
  displayOrderDetails: boolean = false;
  selectedOrder: Order | null = null;
  activeTabIndex: number = 0;

  constructor(
    private _orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'EMart' }, { label: 'Admin' }, { label: 'Orders' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getAllOrdersList();
  }

  getAllOrdersList() {
    this.loading = true;
    this._orderService.getAllOrdersList().subscribe({
      next: (data) => {
        console.log('Full response:', data);
        const orders = data?.payload ?? data; // Fallback if no payload field
        
        if (!Array.isArray(orders)) {
          console.error('Expected an array of orders, got:', orders);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders. Invalid data format.'
          });
          this.loading = false;
          return;
        }
        
        this.fetchAllOrdersList = orders as Order[];
        this.filterOrdersByStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders. Please try again.'
        });
        this.loading = false;
      }
    });
  }

  filterOrdersByStatus(): void {
    // Filter orders by status
    this.pendingOrders = this.fetchAllOrdersList.filter(order => order.orderStatus === 'PENDING');
    this.processingOrders = this.fetchAllOrdersList.filter(order => order.orderStatus === 'PROCESSING');
    this.shippedOrders = this.fetchAllOrdersList.filter(order => order.orderStatus === 'SHIPPED');
    this.deliveredOrders = this.fetchAllOrdersList.filter(order => order.orderStatus === 'DELEVERD');
    this.cancelledOrders = this.fetchAllOrdersList.filter(order => order.orderStatus === 'CANCELLED');
    
    console.log('Pending:', this.pendingOrders);
    console.log('Processing:', this.processingOrders);
    console.log('Shipped:', this.shippedOrders);
    console.log('Delivered:', this.deliveredOrders);
    console.log('Cancelled:', this.cancelledOrders);
  }

  updateStatus(id: number, status: string) {
    this.loading = true;
    const data = {
      id: id,
      orderStatus: status,
    };
    
    this._orderService.updateOrderStatus(data).subscribe({
      next: (response) => {
        console.log('Order updated!', response);
        
        // Update the local order in our arrays
        const updatedOrder = this.fetchAllOrdersList.find(order => order.id === id);
        if (updatedOrder) {
          updatedOrder.orderStatus = status;
          updatedOrder.updatedAt = new Date().toISOString();
          this.filterOrdersByStatus();
        }
        
        // If the order details dialog is open, update the selected order
        if (this.displayOrderDetails && this.selectedOrder && this.selectedOrder.id === id) {
          this.selectedOrder.orderStatus = status;
          this.selectedOrder.updatedAt = new Date().toISOString();
        }
        
        this.successMsg();
        this.loading = false;
      },
      error: (error) => {
        console.log('ERROR :: ' + error.message);
        this.unsuccesMsg();
        this.loading = false;
      }
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = { ...order };
    this.displayOrderDetails = true;
  }

  printOrder(order: Order): void {
    // Create a printable version of the order
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0;">ORDER #${order.id}</h1>
            <p style="margin: 5px 0; color: #666;">Date: ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #666;">Status: ${order.orderStatus}</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0;">TOTAL: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice)}</h2>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${order.receiverName || 'Not provided'}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.receiverPhone || 'Not provided'}</p>
          <p style="margin: 5px 0;"><strong>Address:</strong> ${order.receiverAddress}</p>
          <p style="margin: 5px 0;"><strong>ZIP:</strong> ${order.zip}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f3f4f6;">
                <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Product</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Price</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Quantity</th>
                <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${order.orderItems ? order.orderItems.map(item => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    <div>${item.item?.name || 'Product'}</div>
                    <div style="font-size: 12px; color: #666;">ID: ${item.item?.id || 'N/A'}</div>
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.item?.unitPrice || 0)}
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity || 1}</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((item.item?.unitPrice || 0) * (item.quantity || 1))}
                  </td>
                </tr>
              `).join('') : '<tr><td colspan="4" style="text-align: center; padding: 8px;">No items found</td></tr>'}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
                <td style="text-align: right; padding: 8px; font-weight: bold;">
                  ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(order.totalPrice || 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">
          <p>Thank you for your business!</p>
          <p>This is a computer-generated document. No signature is required.</p>
        </div>
      </div>
    `;
    
    // Open print window
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Order #${order.id} - Print</title>
          </head>
          <body>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to open print window. Please check your browser settings.'
      });
    }
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
  }

  // Helper method to get status badge class
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELEVERD':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  successMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order status updated successfully!',
    });
  }

  unsuccesMsg() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Unable to update Order status!',
    });
  }
}
