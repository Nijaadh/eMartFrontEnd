import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { OrderService } from '../../../../services/order.service';
import { Order } from '../../../../admin/model/Order';
import { OrderItem } from '../../../../admin/model/OrderItem';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';

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

  users: any[] = [];

  // UI state
  loading: boolean = false;
  displayOrderDetails: boolean = false;
  selectedOrder: Order | null = null;
  activeTabIndex: number = 0;

  constructor(
    private _orderService: OrderService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.items = [{ label: 'EMart' }, { label: 'Admin' }, { label: 'Orders' }];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.getAllOrdersList();
    this.getAllUsers();
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
            detail: 'Failed to load orders. Invalid data format.',
          });
          this.loading = false;
          return;
        }

        // Transform orders to ensure totalPrice is present
        this.fetchAllOrdersList = orders.map((order) => {
          // If totalPrice is missing, calculate it from order items
          if (order.totalPrice === undefined || order.totalPrice === null) {
            order.totalPrice =
              order.orderItems?.reduce((total: number, item: OrderItem) => {
                return total + item.item.unitPrice * item.quantity;
              }, 0) || 0;
          }
          return order;
        }) as Order[];

        this.filterOrdersByStatus();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load orders. Please try again.',
        });
        this.loading = false;
      },
    });
  }

  getAllUsers() {
    this.userService.getAllUser().subscribe({
      next: (data) => {
        this.users = data?.payload || [];
        console.log('Users loaded:', this.users.length);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      },
    });
  }

  filterOrdersByStatus(): void {
    // Filter orders by status
    this.pendingOrders = this.fetchAllOrdersList.filter(
      (order) => order.orderStatus === 'PENDING'
    );
    this.processingOrders = this.fetchAllOrdersList.filter(
      (order) => order.orderStatus === 'PROCESSING'
    );
    this.shippedOrders = this.fetchAllOrdersList.filter(
      (order) => order.orderStatus === 'SHIPPED'
    );
    this.deliveredOrders = this.fetchAllOrdersList.filter(
      (order) => order.orderStatus === 'DELEVERD'
    );
    this.cancelledOrders = this.fetchAllOrdersList.filter(
      (order) => order.orderStatus === 'CANCELLED'
    );

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
        const updatedOrder = this.fetchAllOrdersList.find(
          (order) => order.id === id
        );
        if (updatedOrder) {
          updatedOrder.orderStatus = status;
          updatedOrder.updatedAt = new Date().toISOString();
          this.filterOrdersByStatus();
        }

        // If the order details dialog is open, update the selected order
        if (
          this.displayOrderDetails &&
          this.selectedOrder &&
          this.selectedOrder.id === id
        ) {
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
      },
    });
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = { ...order };

    // Process images in order items
    if (this.selectedOrder.orderItems) {
      this.selectedOrder.orderItems = this.selectedOrder.orderItems.map(
        (item) => {
          if (item.item) {
            // If item has an image property, format it
            if (item.item.imageUrl) {
              item.item.imageUrl = this.formatImageUrl(item.item.imageUrl);
            } else if (item.item.imageUrl) {
              item.item.imageUrl = this.formatImageUrl(item.item.imageUrl);
            }
          }
          return item;
        }
      );
    }

    // Find user details if available
    if (order.userId && this.users.length > 0) {
      const user = this.users.find((u) => u.id === order.userId);
      if (user) {
        // If user found, enhance the order with additional user information
        this.selectedOrder.userDetails = {
          name: user.name || user.userName,
          email: user.email,
          phone: user.phone || user.contactNumber,
        };
      }
    }

    this.displayOrderDetails = true;
  }

  printOrder(order: Order): void {
    // Find user details if available
    let userName = order.receiverName || 'Not provided';
    let userPhone = order.receiverPhone || 'Not provided';
    let userEmail = '';

    if (order.userId && this.users.length > 0) {
      const user = this.users.find((u) => u.id === order.userId);
      if (user) {
        userName =
          user.name || user.userName || order.receiverName || 'Not provided';
        userPhone =
          user.phone ||
          user.contactNumber ||
          order.receiverPhone ||
          'Not provided';
        userEmail = user.email || '';
      }
    }

    // Create a printable version of the order
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div>
            <h1 style="margin: 0;">ORDER #${order.id}</h1>
            <p style="margin: 5px 0; color: #666;">Date: ${new Date(
              order.createdAt
            ).toLocaleString()}</p>
            <p style="margin: 5px 0; color: #666;">Status: ${
              order.orderStatus
            }</p>
          </div>
          <div style="text-align: right;">
            <h2 style="margin: 0;">TOTAL: ${new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'LKR',
            }).format(order.totalPrice)}</h2>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 5px;">Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${userName}</p>
          <p style="margin: 5px 0;"><strong>Phone:</strong> ${userPhone}</p>
          ${
            userEmail
              ? `<p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>`
              : ''
          }
          <p style="margin: 5px 0;"><strong>Address:</strong> ${
            order.receiverAddress
          }</p>
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
              ${
                order.orderItems
                  ? order.orderItems
                      .map(
                        (item) => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                    <div>${item.item?.name || 'Product'}</div>
                    <div style="font-size: 12px; color: #666;">ID: ${
                      item.item?.id || 'N/A'
                    }</div>
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'LKR',
                    }).format(item.item?.unitPrice || 0)}
                  </td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">${
                    item.quantity || 1
                  }</td>
                  <td style="text-align: right; padding: 8px; border-bottom: 1px solid #ddd;">
                    ${new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'LKR',
                    }).format(
                      (item.item?.unitPrice || 0) * (item.quantity || 1)
                    )}
                  </td>
                </tr>
              `
                      )
                      .join('')
                  : '<tr><td colspan="4" style="text-align: center; padding: 8px;">No items found</td></tr>'
              }
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align: right; padding: 8px; font-weight: bold;">Total:</td>
                <td style="text-align: right; padding: 8px; font-weight: bold;">
                  ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'LKR',
                  }).format(order.totalPrice || 0)}
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
        detail:
          'Unable to open print window. Please check your browser settings.',
      });
    }
  }

  onTabChange(event: any): void {
    this.activeTabIndex = event.index;
  }

exportAllExcel() {
  import('xlsx').then((xlsx) => {
    // Helper to flatten orders with enhanced formatting
    const flattenOrdersWithSeparation = (orders: any[], status: string) => {
      const flattened: any[] = [];
      
      orders.forEach((order, orderIndex) => {
        // Add order header row
        flattened.push({
          OrderID: `ORDER #${order.id}`,
          OrderDate: this.formatDate(order.createdAt),
          Customer: order.customerName,
          PaymentStatus: order.paymentStatus,
          Address: order.receiverAddress,
          ZIP: order.zip,
          OrderStatus: status,
          ItemID: '',
          Product: '--- ORDER ITEMS ---',
          UnitPrice: '',
          Quantity: '',
          TotalPrice: '',
          ItemTotal: '',
          OrderTotal: this.calculateOrderTotal(order)
        });

        // Add items for this order
        order.orderItems.forEach((item: any, itemIndex: number) => {
          const itemTotal = item.item.unitPrice * item.quantity;
          flattened.push({
            OrderID: orderIndex === 0 && itemIndex === 0 ? `ORDER #${order.id}` : '',
            OrderDate: '',
            Customer: '',
            PaymentStatus: '',
            Address: '',
            ZIP: '',
            OrderStatus: '',
            ItemID: item.item.id,
            Product: `  ${item.item.name}`, // Indent item names
            UnitPrice: this.formatCurrency(item.item.unitPrice),
            Quantity: item.quantity,
            TotalPrice: this.formatCurrency(item.item.unitPrice),
            ItemTotal: this.formatCurrency(itemTotal),
            OrderTotal: ''
          });
        });

        // Add separator row between orders
        if (orderIndex < orders.length - 1) {
          flattened.push({
            OrderID: '',
            OrderDate: '',
            Customer: '',
            PaymentStatus: '',
            Address: '',
            ZIP: '',
            OrderStatus: '',
            ItemID: '',
            Product: '─'.repeat(50),
            UnitPrice: '',
            Quantity: '',
            TotalPrice: '',
            ItemTotal: '',
            OrderTotal: ''
          });
        }
      });

      return flattened;
    };

    // Create enhanced sheets with better formatting
    const createStyledSheet = (data: any[], sheetName: string) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      
      // Set column widths
      worksheet['!cols'] = [
        { wch: 15 }, // OrderID
        { wch: 12 }, // OrderDate
        { wch: 20 }, // Customer
        { wch: 15 }, // PaymentStatus
        { wch: 30 }, // Address
        { wch: 8 },  // ZIP
        { wch: 12 }, // OrderStatus
        { wch: 10 }, // ItemID
        { wch: 25 }, // Product
        { wch: 12 }, // UnitPrice
        { wch: 8 },  // Quantity
        { wch: 12 }, // TotalPrice
        { wch: 12 }, // ItemTotal
        { wch: 15 }  // OrderTotal
      ];

      // Add header styling and freeze panes
      const headerRange = xlsx.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Style headers
      for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = xlsx.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;
        
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "366092" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } }
          }
        };
      }

      // Add autofilter
      worksheet['!autofilter'] = { ref: `A1:${xlsx.utils.encode_cell({ r: 0, c: headerRange.e.c })}` };
      
      // Freeze first row
      worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

      return worksheet;
    };

    // Generate data for each status
    const pendingData = flattenOrdersWithSeparation(this.pendingOrders, 'PENDING');
    const processingData = flattenOrdersWithSeparation(this.processingOrders, 'PROCESSING');
    const shippedData = flattenOrdersWithSeparation(this.shippedOrders, 'SHIPPED');
    const deliveredData = flattenOrdersWithSeparation(this.deliveredOrders, 'DELIVERED');

    // Create summary sheet
    const summaryData = [
      { Status: 'PENDING', 'Total Orders': this.pendingOrders.length, 'Total Items': this.getTotalItems(this.pendingOrders), 'Total Value': this.formatCurrency(this.getTotalValue(this.pendingOrders)) },
      { Status: 'PROCESSING', 'Total Orders': this.processingOrders.length, 'Total Items': this.getTotalItems(this.processingOrders), 'Total Value': this.formatCurrency(this.getTotalValue(this.processingOrders)) },
      { Status: 'SHIPPED', 'Total Orders': this.shippedOrders.length, 'Total Items': this.getTotalItems(this.shippedOrders), 'Total Value': this.formatCurrency(this.getTotalValue(this.shippedOrders)) },
      { Status: 'DELIVERED', 'Total Orders': this.deliveredOrders.length, 'Total Items': this.getTotalItems(this.deliveredOrders), 'Total Value': this.formatCurrency(this.getTotalValue(this.deliveredOrders)) },
      { Status: '', 'Total Orders': '', 'Total Items': '', 'Total Value': '' },
      { Status: 'GRAND TOTAL', 'Total Orders': this.getTotalOrders(), 'Total Items': this.getGrandTotalItems(), 'Total Value': this.formatCurrency(this.getGrandTotalValue()) }
    ];

    // Create workbook with enhanced sheets
    const workbook = {
      Sheets: {
        'Summary': createStyledSheet(summaryData, 'Summary'),
        'Pending Orders': createStyledSheet(pendingData, 'Pending Orders'),
        'Processing Orders': createStyledSheet(processingData, 'Processing Orders'),
        'Shipped Orders': createStyledSheet(shippedData, 'Shipped Orders'),
        'Delivered Orders': createStyledSheet(deliveredData, 'Delivered Orders'),
      },
      SheetNames: [
        'Summary',
        'Pending Orders',
        'Processing Orders',
        'Shipped Orders',
        'Delivered Orders',
      ],
    };

    // Generate Excel file
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    this.saveAsExcelFile(excelBuffer, 'Enhanced_Orders_Report');
  });
}

// Helper methods for better formatting and calculations
formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR'
  }).format(amount);
}

calculateOrderTotal(order: any): string {
  const total = order.orderItems.reduce((sum: number, item: any) => {
    return sum + (item.item.unitPrice * item.quantity);
  }, 0);
  return this.formatCurrency(total);
}

getTotalItems(orders: any[]): number {
  return orders.reduce((total, order) => {
    return total + order.orderItems.reduce((itemTotal: number, item: any) => itemTotal + item.quantity, 0);
  }, 0);
}

getTotalValue(orders: any[]): number {
  return orders.reduce((total, order) => {
    return total + order.orderItems.reduce((orderTotal: number, item: any) => {
      return orderTotal + (item.item.unitPrice * item.quantity);
    }, 0);
  }, 0);
}

getTotalOrders(): number {
  return this.pendingOrders.length + this.processingOrders.length + 
         this.shippedOrders.length + this.deliveredOrders.length;
}

getGrandTotalItems(): number {
  return this.getTotalItems(this.pendingOrders) + this.getTotalItems(this.processingOrders) +
         this.getTotalItems(this.shippedOrders) + this.getTotalItems(this.deliveredOrders);
}

getGrandTotalValue(): number {
  return this.getTotalValue(this.pendingOrders) + this.getTotalValue(this.processingOrders) +
         this.getTotalValue(this.shippedOrders) + this.getTotalValue(this.deliveredOrders);
}

saveAsExcelFile(buffer: any, fileName: string): void {
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  saveAs(data, `${fileName}_${timestamp}.xlsx`);
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

  formatImageUrl(imageData: string): string {
    if (!imageData) {
      return 'assets/images/product-placeholder.png';
    }

    // Check if the image is already a URL or a data URL
    if (imageData.startsWith('http') || imageData.startsWith('data:')) {
      return imageData;
    }

    // Convert base64 to data URL
    return `data:image/png;base64,${imageData}`;
  }
}
