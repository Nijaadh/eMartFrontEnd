import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { GiftBoxService } from '../../../services/gift-box.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;
  fetchingNewGiftBox: any[] = [];
  fetchingAcceptedGift: any[] = [];
  fetchingDeliveredGift: any[] = [];
  ngOnInit(): void {
    this.items = [
      { label: 'EMart' },
      { label: 'Admin' },
      { label: 'Orders' }
    ];
    this.getNewGiftBox();
    this.getAcceptedGift();
    this.getDeliveredGift();
  }

  constructor(private giftBoxService: GiftBoxService,private messageService: MessageService,private router: Router) { }
  getNewGiftBox() {
    this.giftBoxService.getAllGiftBoxNew().subscribe(data => {
      // Assuming data.payload contains the array of users
      this.fetchingNewGiftBox = data.payload;
      console.log(this.fetchingNewGiftBox);
    });


  }
  getAcceptedGift() {
    this.giftBoxService.getAllGiftBoxAccepted().subscribe(data => {
      // Assuming data.payload contains the array of users
      this.fetchingAcceptedGift = data.payload;
    });

  }
  getDeliveredGift() {
    this.giftBoxService.getAllGiftBoxDelivered().subscribe(data => {
      // Assuming data.payload contains the array of users
      this.fetchingDeliveredGift = data.payload;
    });

  }

  updateStatus(id:any,status:any){
    const data={
      id:id,
      commonStatus:status
    }
    this.giftBoxService.updateCommonStatus(data).subscribe((response) => {
      console.log('Paid  succeeded!');
      console.log(response);
      this.successMsg();
     // window.location.reload();
     this.getNewGiftBox();
     this.getAcceptedGift();
     this.getDeliveredGift();
       
    }, (error) => {
      console.log("ERROR PAID  :: " + error)
     this.unsuccesMsg();
    })


  }
 
  successMsg() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'GiftBox updated Successfully!' });
  }
  unsuccesMsg() {
    this.messageService.add({ severity: 'error', summary: 'Success', detail: 'GiftBox updated Unsuccessfully!' });
  }
}
