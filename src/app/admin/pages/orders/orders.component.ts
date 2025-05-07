import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftBoxService } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';

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
  ngOnInit(): void {
    this.items = [{ label: 'EMart' }, { label: 'Admin' }, { label: 'Orders' }];
    this.getPendingOrders();
    this.getProcessingOrders();
    this.getShippedOrders();
  }

  constructor(
    private giftBoxService: GiftBoxService,
    private orderService: OrderService,
    private messageService: MessageService,
    private router: Router
  ) {}

  getPendingOrders() {
    this.orderService.getAllPendingOrders().subscribe((data) => {
      // Assuming data.payload contains the array of users
      this.fetchingPendingOrders = data.payload;
      console.log(this.fetchingPendingOrders);
    });
  }

  getProcessingOrders() {
    this.orderService.getAllProcessingOrders().subscribe((data) => {
      // Assuming data.payload contains the array of users
      this.fetchingProcessingOrders = data.payload;
    });
  }

  getShippedOrders() {
    this.orderService.getAllShippedOrders().subscribe((data) => {
      // Assuming data.payload contains the array of users
      this.fetchingShippedOrders = data.payload;
    });
  }

  getDeliveredOrders() {
    this.orderService.getAllDeliveredOrders().subscribe((data) => {
      // Assuming data.payload contains the array of users
      this.fetchingDeliveredOrders = data.payload;
    });
  }

  updateStatus(id: any, status: any) {
    const data = {
      id: id,
      commonStatus: status,
    };
    this.giftBoxService.updateCommonStatus(data).subscribe(
      (response) => {
        console.log('Paid  succeeded!');
        console.log(response);
        this.successMsg();
        this.getPendingOrders();
        this.getProcessingOrders();
        this.getShippedOrders();
      },
      (error) => {
        console.log('ERROR PAID  :: ' + error);
        this.unsuccesMsg();
      }
    );
  }

  successMsg() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'GiftBox updated Successfully!',
    });
  }
  unsuccesMsg() {
    this.messageService.add({
      severity: 'error',
      summary: 'Success',
      detail: 'GiftBox updated Unsuccessfully!',
    });
  }
}
