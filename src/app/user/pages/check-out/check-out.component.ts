import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { GiftBoxService } from '../../../services/gift-box.service';
import { GiftItemsService } from '../../../services/gift-items.service';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit {
  giftBoxitems: any[] = [];
  receivedData: any;
  id: any;
  giftboxCount: number = 0;
  totalPrice: any;

  date: any;
  note!: any;
  zip: any;
  address: any;

  giftBoxID: any;

  item = {
    giftName: "",
    createdAt: "",
    sendingDate: "",
    recieverAddress: "",
    zip: "",
    totalPrice: "",
    commonStatus: "ACTIVE",
    itemIds: [],
    userId: ""

  }


  //------image-priview--------
  showModal: boolean = false;
  previewImage: string = '';



  constructor(
    private router: Router,
    private sharedDataService: SharedDataService,
    private giftItemsService: GiftItemsService,
    private giftBoxService: GiftBoxService,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.id = localStorage.getItem('id');
    }
    this.receivedData = this.sharedDataService.getData();
    this.giftboxCount = this.receivedData.length || 0;
    console.log(this.receivedData);
    if (this.receivedData != null) {
      this.getGiftBoxItems();
    }


    console.log("JWT" + this.authService.getToken());
  }
  // Method to open the image preview modal
  openImagePreview(image: string) {
    this.previewImage = image;
    this.showModal = true;
  }

  // Method to close the modal
  closeModal() {
    this.showModal = false;
  }
  getGiftBoxItems(): void { //Get GiftBox items details
    //console.log("ffff" + this.giftBoxItems);
    this.giftItemsService.getAllGiftBoxItems(this.receivedData).subscribe((data: any) => {
      if (data.status) {
        this.giftBoxitems = data.payload[0].map((item: any) => ({
          ...item,
          image: item.image ? 'data:image/png;base64,' + item.image : ''
        }));
        // this.giftBoxItemsDetails = data.payload[0];
        console.log(this.giftBoxitems);

        const totalPrice = this.giftBoxitems.reduce((acc, item) => acc + parseFloat(item.unitPrice), 0);
        console.log(totalPrice);  // Outputs the total price of all products
        this.totalPrice = totalPrice;
      } else {
        console.error(data.errorMessages);
      }

    },
      (error) => {
        console.error('Error fetching items:', error);
      });

  }


  removeItemFromArray(item: number): void {
    const index = this.receivedData.indexOf(item);

    if (index !== -1) {
      // Item exists in the array, so remove it
      this.receivedData.splice(index, 1);
      this.getGiftBoxItems();
      this.giftboxCount = this.receivedData.length;
      console.log(`Item ${item} removed. Updated array:`, this.receivedData);
    } else {
      console.log(`Item ${item} not found in the array.`);
    }
  }

  savereciever() {

    const selectedDate = new Date(this.date);

    this.item.recieverAddress = this.address;
    this.item.sendingDate = selectedDate.toISOString().split('T')[0];
    this.item.giftName = this.note;
    this.item.zip = this.zip;

    console.log(this.item);

    this.address = '';
    this.note = '';
    this.zip = '';
  }
  saveGift() {

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');

    this.item.createdAt = `${year}-${month}-${day}`;
    this.item.userId = this.id;
    this.item.itemIds = this.receivedData;
    this.item.totalPrice = this.totalPrice;
    console.log(this.item);
    if (this.item.recieverAddress == '' ||
      this.item.giftName == '' ||
      this.item.zip == '' ||
      this.item.sendingDate == '') {
      alert("Fill receiver details");
    } else {
      this.giftBoxService.addGiftItem(this.item).subscribe(
        {
          next:
            response => {
              const id = response.payload;
              this.giftBoxID = id;
              localStorage.setItem('giftBoxID', id);
              localStorage.setItem('giftBoxPrice', this.totalPrice);
              console.log("id ::" + id);
              this.GiftBoxSaveSuccessMsg();
            }
          ,
          error: (error) => {
            console.error("Error:", error);
            this.GiftBoxSaveUnsuccessMsg();
          }
        }
      )
    }
  }
  checkOut() {
    this.saveGift();
  }
  GiftBoxSaveSuccessMsg() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'GiftBox Successfully Saved!' });
  }
  GiftBoxSaveUnsuccessMsg() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'GiftBox saving Unsuccessfully!' });
  }
}
