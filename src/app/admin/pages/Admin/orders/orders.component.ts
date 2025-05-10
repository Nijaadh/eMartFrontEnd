import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftBoxService } from '../../../../services/cart.service';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  fetchingPendingOrders: any[] = [];
  fetchingProcessingOrders: any[] = [];
  fetchingShippedOrders: any[] = [];
  fetchingDeliveredOrders: any[] = [];
  fetchAllOrdersList: any[] = [];
  pendingOrders: any[] = [];
  processingOrders: any[] = [];
  shippedOrders: any[] = [];
  deliveredOrders: any[] = [];

  ngOnInit(): void {
    this.items = [{ label: 'EMart' }, { label: 'Admin' }, { label: 'Orders' }];
    // this.getPendingOrders();
    // this.getProcessingOrders();
    // this.getShippedOrders();
    // this.getDeliveredOrders();
    this.getAllOrdersList();
  }

  constructor(
    private _orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  // getPendingOrders() {
  //   this._orderService.getAllPendingOrders().subscribe((data) => {
  //     // Assuming data.payload contains the array of users
  //     this.fetchingPendingOrders = data.payload;
  //     console.log(this.fetchingPendingOrders);
  //   });
  // }

  // getProcessingOrders() {
  //   this._orderService.getAllProcessingOrders().subscribe((data) => {
  //     // Assuming data.payload contains the array of users
  //     this.fetchingProcessingOrders = data.payload;
  //   });
  // }

  // getShippedOrders() {
  //   this._orderService.getAllShippedOrders().subscribe((data) => {
  //     // Assuming data.payload contains the array of users
  //     this.fetchingShippedOrders = data.payload;
  //   });
  // }

  // getDeliveredOrders() {
  //   this._orderService.getAllDeliveredOrders().subscribe((data) => {
  //     // Assuming data.payload contains the array of users
  //     this.fetchingDeliveredOrders = data.payload;
  //   });
  // }

  getAllOrdersList() {
    this._orderService.getAllOrdersList().subscribe((data) => {
      console.log('Full response:', data); // Add this
  
      const orders = data?.payload ?? data; // Fallback if no payload field
  
      if (!Array.isArray(orders)) {
        console.error('Expected an array of orders, got:', orders);
        return;
      }
  
      this.fetchAllOrdersList = orders;
  
      this.pendingOrders = orders.filter(order => order.orderStatus === 'PENDING');
      this.processingOrders = orders.filter(order => order.orderStatus === 'PROCESSING');
      this.shippedOrders = orders.filter(order => order.orderStatus === 'SHIPPED');
      this.deliveredOrders = orders.filter(order => order.orderStatus === 'DELEVERD');
  
      console.log('Pending:', this.pendingOrders);
      console.log('Processing:', this.processingOrders);
      console.log('Shipped:', this.shippedOrders);
      console.log('Delivered:', this.deliveredOrders);
    });
  }
  

  updateStatus(id: any, status: any) {
    const data = {
      id: id,
      orderStatus: status,
    };
    this._orderService.updateOrderStatus(data).subscribe(
      (response) => {
        console.log('order updated!');
        console.log(response);
        this.successMsg();
        // this.getPendingOrders();
        // this.getProcessingOrders();
        // this.getShippedOrders();
        // this.getDeliveredOrders();
        this.getAllOrdersList();
      },
      (error) => {
        console.log('ERROR PAID  :: ' + error.message);
        this.unsuccesMsg();
      }
    );
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
      summary: 'Success',
      detail: 'Unable to update Order status!',
    });
  }
}
